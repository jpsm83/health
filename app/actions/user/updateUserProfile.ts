"use server";

import { IUpdateProfileData, ISerializedUser } from "@/types/user";
import { IApiResponse } from "@/types/api";

// Note: This action calls the API route because the route handles
// FormData parsing, file uploads, and Cloudinary cleanup.
// For file uploads, call the route directly with FormData from the frontend.

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000");

export async function updateUserProfile(
  userId: string | { toString(): string },
  profileData: IUpdateProfileData
): Promise<IApiResponse<ISerializedUser>> {
  try {
    // Convert userId to string if it's an object
    const userIdStr = typeof userId === 'string' ? userId : userId.toString();

    // Note: The route expects FormData for file uploads
    // For JSON-only updates, we can send JSON, but for file uploads use FormData
    const formData = new FormData();
    if (profileData.username) formData.append("username", profileData.username);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.role) formData.append("role", profileData.role);
    if (profileData.birthDate) formData.append("birthDate", profileData.birthDate);
    if (profileData.preferences) {
      formData.append("language", profileData.preferences.language);
      formData.append("region", profileData.preferences.region);
    }
    if (profileData.imageFile) {
      formData.append("imageFile", profileData.imageFile);
    }

    const response = await fetch(`${baseUrl}/api/v1/users/${userIdStr}`, {
      method: "PATCH",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update user profile",
      };
    }

    return {
      success: true,
      message: result.message || "User profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update user profile";
    
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
