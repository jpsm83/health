"use server";

import { hash, compare } from "bcrypt";
import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";
import passwordValidation from "@/lib/utils/passwordValidation";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import { IUpdateProfileData, IUser, IUserPreferences, ISerializedUser } from "@/types/user";
import { roles } from "@/lib/constants";
import { IApiResponse } from "@/types/api";

// Helper function to serialize MongoDB user object with subscription preferences
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeUser(user: any, subscriptionPreferences?: any): ISerializedUser {
  // Helper function to ensure plain object conversion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toPlainObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== 'object') return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(toPlainObject);
    
    // Convert to plain object to remove any MongoDB-specific methods
    return JSON.parse(JSON.stringify(obj));
  };

  return {
    _id: user._id?.toString() || "",
    username: user.username || "",
    email: user.email || "",
    role: user.role || "",
    birthDate: user.birthDate?.toISOString() || new Date().toISOString(),
    imageFile: user.imageFile,
    imageUrl: user.imageUrl,
    preferences: toPlainObject(user.preferences) || { language: "en", region: "US" },
    subscriptionId: user.subscriptionId?.toString() || null,
    lastLogin: user.lastLogin?.toISOString(),
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
    likedArticles: user.likedArticles?.map((id: string) => id.toString()) || [],
    commentedArticles: user.commentedArticles?.map((id: string) => id.toString()) || [],
    subscriptionPreferences: subscriptionPreferences ? {
      categories: Array.isArray(subscriptionPreferences.categories) 
        ? subscriptionPreferences.categories.map((cat: unknown) => String(cat))
        : [],
      subscriptionFrequencies: String(subscriptionPreferences.subscriptionFrequencies || "weekly")
    } : {
      categories: [],
      subscriptionFrequencies: "weekly"
    },
  };
}

export async function updateUserProfile(
  userId: string | { toString(): string },
  profileData: IUpdateProfileData,
  sessionUserId: string
): Promise<IApiResponse<ISerializedUser>> {
  try {
    // Convert userId to string if it's an object
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();
    
    // Validate ObjectId
    if (!isObjectIdValid([userIdStr])) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userIdStr);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if the user is the same user (authorization)
    // Convert both to strings for reliable comparison
    const userObjectIdString = user.id.toString();
    const sessionUserIdString = sessionUserId.toString();
    
    if (userObjectIdString !== sessionUserIdString) {
      return {
        success: false,
        message: "You are not authorized to update this user!",
      };
    }

    // Prepare update object
    const updateData: Partial<IUser> = {};

    // Handle password change if provided
    if (profileData.currentPassword && profileData.newPassword) {
      // Verify current password
      const isCurrentPasswordValid = await compare(profileData.currentPassword, user.password || "");
      
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      // Validate new password
      if (!passwordValidation(profileData.newPassword)) {
        return {
          success: false,
          message: "New password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!",
        };
      }

      // Hash new password
      updateData.password = await hash(profileData.newPassword, 10);
    }

    // Update username if provided
    if (profileData.username && user.username !== profileData.username) {
      updateData.username = profileData.username;
    }

    // Update email if provided
    if (profileData.email && user.email !== profileData.email) {
      const duplicateEmail = await User.findOne({
        email: profileData.email,
        _id: { $ne: userIdStr },
      });
      if (duplicateEmail) {
        return {
          success: false,
          message: "Email is already taken by another user",
        };
      }
      updateData.email = profileData.email;
    }

    // Update role if provided
    if (profileData.role) {
      if (!roles.includes(profileData.role)) {
        return {
          success: false,
          message: "Invalid role",
        };
      }
      if (user.role !== profileData.role) {
        updateData.role = profileData.role;
      }
    }

    // Update birth date if provided
    if (profileData.birthDate) {
      const parsedBirthDate = new Date(profileData.birthDate);
      if (user.birthDate.toISOString() !== parsedBirthDate.toISOString()) {
        updateData.birthDate = parsedBirthDate;
      }
    }

    // Update preferences - handle exactly like userService
    if (profileData.preferences) {
      const preferences: IUserPreferences = {
        language: profileData.preferences.language,
        region: profileData.preferences.region,
      };
      
      if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
        updateData.preferences = preferences;
      }
    } else {
      // Default values if not provided (matches userService behavior)
      const defaultPreferences: IUserPreferences = {
        language: "en",
        region: "US",
      };
      
      if (JSON.stringify(user.preferences) !== JSON.stringify(defaultPreferences)) {
        updateData.preferences = defaultPreferences;
      }
    }

    // Update subscription preferences if provided and user has a subscription
    if (profileData.subscriptionPreferences && user && !Array.isArray(user) && user.subscriptionId) {
      try {
        await Subscriber.findByIdAndUpdate(
          user.subscriptionId,
          {
            $set: {
              subscriptionPreferences: profileData.subscriptionPreferences
            }
          }
        );
      } catch (error) {
        console.error("Error updating subscription preferences:", error);
        // Don't fail the entire update if subscription preferences fail
      }
    }

    // Handle image upload if provided
    const isNewImageProvided =
      profileData.imageFile &&
      profileData.imageFile instanceof File &&
      profileData.imageFile.size > 0 &&
      profileData.imageFile.name !== user.imageFile;

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
      const folder = `/users/${userIdStr}`;

      const uploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: [profileData.imageFile!], // We know it's not undefined due to the check above
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

      updateData.imageFile = profileData.imageFile!.name;
      updateData.imageUrl = uploadResponse[0];
    } else {
      // CASE: No new image provided at all (imageFile is undefined/null/empty)
      const isImageFileMissingOrEmpty =
        !profileData.imageFile || !(profileData.imageFile instanceof File) || profileData.imageFile.size === 0;

      if (isImageFileMissingOrEmpty && user.imageFile) {
        const deleteResult = await deleteUserImage();
        if (!deleteResult.success) return deleteResult;

        await User.updateOne(
          { _id: userIdStr },
          {
            $unset: {
              imageFile: "",
              imageUrl: "",
            },
          }
        );
      }
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      // Get updated subscription preferences for return
      let subscriptionPreferences = null;
      if (user && !Array.isArray(user) && user.subscriptionId) {
        const subscriber = await Subscriber.findById(user.subscriptionId)
          .select("subscriptionPreferences")
          .lean();
        if (subscriber && !Array.isArray(subscriber) && subscriber.subscriptionPreferences) {
          // Ensure plain object conversion
          subscriptionPreferences = JSON.parse(JSON.stringify(subscriber.subscriptionPreferences));
        }
      }
      
      return {
        success: true,
        data: serializeUser(user, subscriptionPreferences), // Return serialized user data with subscription preferences
        message: "No changes to update",
      };
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userIdStr,
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

    // Get updated subscription preferences for return
    let subscriptionPreferences = null;
    if (updatedUser && !Array.isArray(updatedUser) && updatedUser.subscriptionId) {
      const subscriber = await Subscriber.findById(updatedUser.subscriptionId)
        .select("subscriptionPreferences")
        .lean();
      if (subscriber && !Array.isArray(subscriber) && subscriber.subscriptionPreferences) {
        // Ensure plain object conversion
        subscriptionPreferences = JSON.parse(JSON.stringify(subscriber.subscriptionPreferences));
      }
    }

    return {
      success: true,
      data: serializeUser(updatedUser, subscriptionPreferences), // Return serialized updated user data with subscription preferences
      message: "User profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update user profile",
    };
  }
}
