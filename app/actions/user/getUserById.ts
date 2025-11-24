"use server";

import { ISerializedUser, IUserResponse } from "@/types/user";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getUserById(userId: string): Promise<IUserResponse> {
  try {
    const user = await internalFetch<ISerializedUser>(`/api/v1/users/${userId}`);

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.error("Get user by userId failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Get user by userId failed!";

    // Check if it's a 404
    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
