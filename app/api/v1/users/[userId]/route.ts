import { NextResponse } from "next/server";
import { hash } from "bcrypt";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { isValidUrl } from "@/lib/utils/isValidUrl";
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
    const { userId } = context.params;

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
    const { userId } = context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse FORM DATA instead of JSON because we might have an image file
    const formData = await req.formData();

    // Extract fields from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const gender = formData.get("gender") as string;
    const birthDate = formData.get("birthDate") as string;
    const imageUrl = formData.get("imageUrl") as File;

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
      !password ||
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
            "Username, email, password, role, gender, birthDate, language, region, contentLanguage, and categoryInterestsRaw are required!",
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

    // Prepare update object
    const updateData: Partial<IUser> = {};

    // update username
    if (user.username !== username) updateData.username = username;

    // update email
    if (user.email !== email) {
      // Check if email is already taken by another user
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

    // update roles
    if (!roles.includes(role)) {
      return new NextResponse(JSON.stringify({ message: "Invalid role" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      if (user.role !== role) updateData.role = role;
    }

    // update gender
    if (!genders.includes(gender)) {
      return new NextResponse(JSON.stringify({ message: "Invalid gender" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      if (user.gender !== gender) updateData.gender = gender;
    }

    // update birth date
    if (user.birthDate !== birthDate)
      updateData.birthDate = new Date(birthDate);

    const preferences: IUserPreferences = {
      language,
      region,
      contentLanguage,
    };

    // update preferences
    if (JSON.stringify(user.preferences) !== JSON.stringify(preferences))
      updateData.preferences = preferences;

    // update category interests
    if (
      JSON.stringify(user.categoryInterests || "") !==
      (categoryInterestsRaw || "")
    ) {
      // Parse categoryInterests from formData
      const categoryInterests = JSON.parse(
        categoryInterestsRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
      ) as ICategoryInterest[];

      if (categoryInterests && categoryInterests.length > 0) {
        const categoryInterestsRequiredFields = [
          "type",
          "newsletterSubscription",
          "subscriptionFrequencies",
        ];

        // Validate category interests
        let categoryInterestsValidation: string | boolean = true;

        if (categoryInterests && categoryInterests.length > 0) {
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
        } else {
          categoryInterestsValidation = false;
        }

        if (categoryInterestsValidation !== true) {
          return new NextResponse(
            JSON.stringify({
              message:
                categoryInterestsValidation || "Invalid category interests",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        } else {
          updateData.categoryInterests = categoryInterests;
        }
      } else {
        updateData.categoryInterests = undefined;
      }
    }

    // Handle image upload if provided
    if (imageUrl && imageUrl instanceof File && imageUrl.size > 0) {
      const folder = `/users/${userId}`;

      // first upload new image
      const cloudinaryUploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: [imageUrl], // only one image
        onlyImages: true,
      });

      if (
        typeof cloudinaryUploadResponse === "string" ||
        cloudinaryUploadResponse.length === 0 ||
        !cloudinaryUploadResponse.every((str) => str.includes("https://"))
      ) {
        return new NextResponse(
          JSON.stringify({
            message: `Error uploading image: ${cloudinaryUploadResponse}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // if new image been created, then delete the old one
      const deleteFilesCloudinaryResult: string | boolean =
        await deleteFilesCloudinary(user?.imageUrl || "");

      // check if deleteFilesCloudinary failed
      if (deleteFilesCloudinaryResult !== true) {
        return new NextResponse(
          JSON.stringify({ message: deleteFilesCloudinaryResult }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      updateData.imageUrl = cloudinaryUploadResponse[0];
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        lean: true,
      }
    ).select("-password");

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
        user: updatedUser,
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

// @desc    Delete user
// @route   DELETE /users/:userId
// @access  Private
export const DELETE = async (
  req: Request,
  context: { params: { userId: string } }
) => {
  try {
    const { userId } = context.params;

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

    // do not delete user from database, just set isActive to false
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
