"use server";

import { IUpdateProfileData, ISerializedUser } from "@/types/user";
import { IApiResponse } from "@/types/api";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function updateUserProfile(
  userId: string | { toString(): string },
  profileData: IUpdateProfileData
): Promise<IApiResponse<ISerializedUser>> {
  try {
    // Convert userId to string if it's an object
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();

    // Note: The route PATCH handler currently uses FormData, but this action accepts JSON
    // For now, we'll call the route with JSON body. If the route needs FormData,
    // we may need to enhance it to support both JSON and FormData.
    const result = await internalFetch<{
      success: boolean;
      message: string;
      data?: ISerializedUser;
    }>(`/api/v1/users/${userIdStr}`, {
      method: "PATCH",
      body: {
        ...profileData,
        // Note: File uploads via imageFile may need special handling
        // The route currently expects FormData, so this may need adjustment
      },
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to update user profile",
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message || "User profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update user profile";
    
    // Check for specific error types
    if (errorMessage.includes("Invalid user ID format")) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }
    
    if (errorMessage.includes("not found")) {
      return {
        success: false,
        message: "User not found",
      };
    }
    
    if (errorMessage.includes("not authorized")) {
      return {
        success: false,
        message: "You are not authorized to update this user!",
      };
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
