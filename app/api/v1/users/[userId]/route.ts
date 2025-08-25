import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";

// imported models
import User from "@/app/api/models/user";

// imported interfaces
import { IUser, IUserPreferences } from "@/interfaces/user";

// imported constants
import { roles } from "@/lib/constants";

// @desc    Get user by userId
// @route   GET /users/[userId]
// @access  Public
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await context.params;
    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if user exists
    const user = (await User.findById(userId)
      .select("-password")
      .lean()) as Partial<IUser>;

    // Additional authorization check
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError(
      "Get user by userId failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

// @desc    Update user
// @route   PATCH /users/[userId]
// @access  Private
export const PATCH = async (
  req: Request,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    // validate session
    const session = await auth();

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to update a user",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse FORM DATA
    const formData = await req.formData();

    // Extract fields from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const birthDate = formData.get("birthDate") as string;
    const imageFile = formData.get("imageFile") as File;

    // Preferences
    const language = formData.get("language") as string;
    const region = formData.get("region") as string;
    const contentLanguage = formData.get("contentLanguage") as string;

    // Subscription Preferences (parse as JSON)
    const subscriptionPreferencesRaw = formData.get("subscriptionPreferences") as string;

    // Validate required fields
    if (
      !username ||
      !email ||
      !role ||
      !birthDate ||
      !language ||
      !region ||
      !contentLanguage
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Username, email, role, birthDate, language, region, and contentLanguage are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // check if the user is the same user
    if (user.id !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to update this user!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare update object
    const updateData: Partial<IUser> = {};

    // Validate and update username
    if (user.username !== username) updateData.username = username;

    // Validate and update email
    if (user.email !== email) {
      const duplicateEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (duplicateEmail) {
        return new NextResponse(
          JSON.stringify({ message: "Email is already taken by another user" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      updateData.email = email;
    }

    // Validate and update role
    if (!roles.includes(role)) {
      return new NextResponse(JSON.stringify({ message: "Invalid role" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    if (user.role !== role) updateData.role = role;

    // Update birth date
    const parsedBirthDate = new Date(birthDate);
    if (user.birthDate.toISOString() !== parsedBirthDate.toISOString()) {
      updateData.birthDate = parsedBirthDate;
    }

    // Update preferences
    const preferences: IUserPreferences = {
      language,
      region,
      contentLanguage,
    };
    if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
      updateData.preferences = preferences;
    }

    // Update subscription preferences
    if (subscriptionPreferencesRaw) {
      try {
        const subscriptionPreferences = JSON.parse(
          subscriptionPreferencesRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
        );

        if (subscriptionPreferences && subscriptionPreferences.categories && subscriptionPreferences.subscriptionFrequencies) {
          updateData.subscriptionPreferences = subscriptionPreferences;
        }
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: "Invalid subscription preferences format",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Handle image upload if provided
    const isNewImageProvided =
      imageFile &&
      imageFile instanceof File &&
      imageFile.size > 0 &&
      imageFile.name !== user.imageFile;

    const deleteUserImage = async () => {
      if (user.imageFile) {
        const deleteResult: string | boolean = await deleteFilesCloudinary(
          user.imageUrl || ""
        );
        if (deleteResult !== true) {
          return new NextResponse(JSON.stringify({ message: deleteResult }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      return true;
    };

    if (isNewImageProvided) {
      const folder = `/users/${userId}`;

      const uploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: [imageFile],
        onlyImages: true,
      });

      const isUploadValid =
        Array.isArray(uploadResponse) &&
        uploadResponse.length > 0 &&
        uploadResponse.every((url) => url.includes("https://"));

      if (!isUploadValid) {
        return new NextResponse(
          JSON.stringify({
            message: `Error uploading image: ${uploadResponse}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const deleteResult = await deleteUserImage();
      if (deleteResult !== true) return deleteResult;

      updateData.imageFile = imageFile.name;
      updateData.imageUrl = uploadResponse[0];
    } else {
      // CASE: No new image provided at all (imageFile is undefined/null/empty)
      const isImageFileMissingOrEmpty =
        !imageFile || !(imageFile instanceof File) || imageFile.size === 0;

      if (isImageFileMissingOrEmpty && user.imageFile) {
        const deleteResult = await deleteUserImage();
        if (deleteResult !== true) return deleteResult;

        await User.updateOne(
          { _id: userId },
          {
            $unset: {
              imageFile: "",
              imageUrl: "",
            },
          }
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        lean: true,
      }
    );

    // check if updatedUser is undefined
    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "User updated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Update user failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

// @desc    Deactivate user
// @route   DELETE /users/[userId]
// @access  Private
export const DELETE = async (
  req: Request,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    // validate session
    const session = await auth();

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to deactivate a user",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found!" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // check if the user is the same user
    if (user.id !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to deactivate this user!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Deactivate user
    await User.findByIdAndUpdate(userId, { $set: { isActive: false } });

    return new NextResponse(
      JSON.stringify({
        message: "User deactivated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Deactivate user failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
