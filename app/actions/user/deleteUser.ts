"use server";

import { IDeleteUserResponse } from "@/types/user";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function deleteUser(
  userId: string
): Promise<IDeleteUserResponse> {
  try {
    const result = await internalFetch<{ message: string }>(
      `/api/v1/users/${userId}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: true,
      message: result.message || "User deactivated successfully",
    };
  } catch (error) {
    console.error("Deactivate user failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Deactivate user failed!";

    // Check error status
    if (errorMessage.includes("not authorized") || errorMessage.includes("403")) {
      return {
        success: false,
        message: "You are not authorized to deactivate this user!",
      };
    }

    if (errorMessage.includes("not found") || errorMessage.includes("404")) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
