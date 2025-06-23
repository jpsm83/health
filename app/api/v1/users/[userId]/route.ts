import { NextResponse } from "next/server";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";

// imported models
import User from "@/app/api/models/user";

// imported interfaces
import { IUser, ICategoryInterest, IUserPreferences } from "@/interfaces/user";

// imported constants
import { roles, genders } from "@/lib/constants";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";

// @desc    Get user by userId
// @route   GET /users/[userId]
// @access  Private
export const GET = async (
  req: Request,
  context: { params: { userId: string } }
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
    const user = await User.findById(userId).select("-password").lean();

    return !user
      ? new NextResponse(JSON.stringify({ message: "User not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      : new NextResponse(JSON.stringify(user), {
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
// @route   PATCH /users/:userId
// @access  Private
export const PATCH = async (
  req: Request,
  context: { params: { userId: string } }
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

    // Parse FORM DATA
    const formData = await req.formData();

    // Extract fields from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate") as string;
    const imageFile = formData.get("imageFile") as File;

    // Preferences
    const language = formData.get("language") as string;
    const region = formData.get("region") as string;
    const contentLanguage = formData.get("contentLanguage") as string;

    // Category Interests (parse as JSON)
    const categoryInterestsRaw = formData.get("categoryInterests") as string;

    // Validate required fields
    if (
      !username ||
      !email ||
      !role ||
      !gender ||
      !birthDate ||
      !language ||
      !region ||
      !contentLanguage ||
      !categoryInterestsRaw
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Username, email, role, gender, birthDate, language, region, contentLanguage, and categoryInterestsRaw are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId).select("-categoryInterests._id");

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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

    // Validate and update gender
    if (!genders.includes(gender)) {
      return new NextResponse(JSON.stringify({ message: "Invalid gender" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (user.gender !== gender) updateData.gender = gender;

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

    // Update category interests
    if (
      JSON.stringify(user.categoryInterests || "")
        .trim()
        .replace(/[^a-zA-Z]/g, "") !==
      (categoryInterestsRaw || "").trim().replace(/[^a-zA-Z]/g, "")
    ) {
      const categoryInterests = JSON.parse(
        categoryInterestsRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
      ) as ICategoryInterest[];

      if (categoryInterests && categoryInterests.length > 0) {
        const categoryInterestsRequiredFields = [
          "type",
          "newsletterSubscription",
          "subscriptionFrequencies",
        ];

        let categoryInterestsValidation: string | boolean = true;
        for (const interest of categoryInterests) {
          const validationResult = objDefaultValidation(
            interest as unknown as {
              [key: string]: string | number | boolean | undefined;
            },
            {
              reqFields: categoryInterestsRequiredFields,
              nonReqFields: [],
            }
          );

          if (validationResult !== true) {
            categoryInterestsValidation = validationResult;
            break;
          }
        }

        if (categoryInterestsValidation !== true) {
          return new NextResponse(
            JSON.stringify({
              message:
                categoryInterestsValidation || "Invalid category interests",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        updateData.categoryInterests = categoryInterests;
      } else {
        updateData.categoryInterests = undefined;
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
// @route   DELETE /users/:userId
// @access  Private
export const DELETE = async (
  req: Request,
  context: { params: { userId: string } }
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
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
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
