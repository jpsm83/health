"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import { ISerializedUser, IUserResponse } from "@/interfaces/user";

// Helper function to serialize MongoDB user object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeUser(user: any): ISerializedUser {
  return {
    _id: user._id?.toString() || "",
    username: user.username,
    email: user.email,
    role: user.role,
    birthDate: user.birthDate?.toISOString() || new Date().toISOString(),
    imageFile: user.imageFile,
    imageUrl: user.imageUrl,
    preferences: user.preferences,
    subscriptionId: user.subscriptionId?.toString() || null,
    lastLogin: user.lastLogin?.toISOString(),
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

export async function getUserById(userId: string): Promise<IUserResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return {
        success: false,
        message: "Invalid user ID format",
      };
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Serialize user for client components
    const serializedUser = serializeUser(user);

    return {
      success: true,
      data: serializedUser,
    };
  } catch (error) {
    console.error("Get user by userId failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get user by userId failed!",
    };
  }
}
