"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import { IDeleteUserResponse } from "@/interfaces/user";

export async function deleteUser(
  userId: string,
  sessionUserId: string
): Promise<IDeleteUserResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return {
        success: false,
        message: "Invalid user ID format!",
      };
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    // Check if the user is the same user (authorization)
    if (user.id !== sessionUserId) {
      return {
        success: false,
        message: "You are not authorized to deactivate this user!",
      };
    }

    // Deactivate user
    await User.findByIdAndUpdate(userId, { $set: { isActive: false } });

    return {
      success: true,
      message: "User deactivated successfully",
    };
  } catch (error) {
    console.error("Deactivate user failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deactivate user failed!",
    };
  }
}
