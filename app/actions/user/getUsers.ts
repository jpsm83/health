"use server";

import connectDb from "@/app/api/db/connectDb";
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
    subscriptionPreferences: {
      categories: [],
      subscriptionFrequencies: "weekly"
    },
    likedArticles: user.likedArticles?.map((id: unknown) => {
      if (id && typeof id === 'object' && 'toString' in id) {
        return id.toString();
      }
      return String(id);
    }) || [],
    commentedArticles: user.commentedArticles?.map((id: unknown) => {
      if (id && typeof id === 'object' && 'toString' in id) {
        return id.toString();
      }
      return String(id);
    }) || [],
    lastLogin: user.lastLogin?.toISOString(),
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };
}

export async function getUsers(): Promise<IUserResponse> {
  try {
    // Connect to database
    await connectDb();

    // Fetch all users excluding password
    const users = await User.find().select("-password").lean();

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users found!",
      };
    }

    // Serialize users for client components
    const serializedUsers = users.map(serializeUser);

    return {
      success: true,
      data: serializedUsers,
    };
  } catch (error) {
    console.error("Get all users failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get all users failed!",
    };
  }
}
