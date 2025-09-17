"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";
import User from "@/app/api/models/user";
import { IUser, IUserPreferences } from "@/types/user";
import { IUpdateUserParamsRequired, IUpdateUserResponse } from "@/types/user";
import { roles } from "@/lib/constants";

export async function updateUser(
  userId: string,
  params: IUpdateUserParamsRequired,
  sessionUserId: string
): Promise<IUpdateUserResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }

    const {
      username,
      email,
      role,
      birthDate,
      language,
      region,
      imageFile,
    } = params;

    // Validate required fields
    if (
      !username ||
      !email ||
      !role ||
      !birthDate ||
      !language ||
      !region
    ) {
      return {
        success: false,
        message: "Username, email, role, birthDate, language and region are required!",
      };
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if the user is the same user (authorization)
    if (user.id !== sessionUserId) {
      return {
        success: false,
        message: "You are not authorized to update this user!",
      };
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
        return {
          success: false,
          message: "Email is already taken by another user",
        };
      }
      updateData.email = email;
    }

    // Validate and update role
    if (!roles.includes(role)) {
      return {
        success: false,
        message: "Invalid role",
      };
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
    };
    if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
      updateData.preferences = preferences;
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
          return {
            success: false,
            message: deleteResult as string,
          };
        }
      }
      return { success: true };
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
        return {
          success: false,
          message: `Error uploading image: ${uploadResponse}`,
        };
      }

      const deleteResult = await deleteUserImage();
      if (!deleteResult.success) return deleteResult;

      updateData.imageFile = imageFile.name;
      updateData.imageUrl = uploadResponse[0];
    } else {
      // CASE: No new image provided at all (imageFile is undefined/null/empty)
      const isImageFileMissingOrEmpty =
        !imageFile || !(imageFile instanceof File) || imageFile.size === 0;

      if (isImageFileMissingOrEmpty && user.imageFile) {
        const deleteResult = await deleteUserImage();
        if (!deleteResult.success) return deleteResult;

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

    // Check if updatedUser is undefined
    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Update user failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update user failed!",
    };
  }
}
