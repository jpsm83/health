"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import { ISerializedUser, IUserResponse } from "@/interfaces/user";

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
    username: user.username,
    email: user.email,
    role: user.role,
    birthDate: user.birthDate?.toISOString() || new Date().toISOString(),
    imageFile: user.imageFile,
    imageUrl: user.imageUrl,
    preferences: toPlainObject(user.preferences) || { language: "en", region: "US" },
    subscriptionId: user.subscriptionId?.toString() || null,
    subscriptionPreferences: subscriptionPreferences ? {
      categories: Array.isArray(subscriptionPreferences.categories) 
        ? subscriptionPreferences.categories.map((cat: unknown) => String(cat))
        : [],
      subscriptionFrequencies: String(subscriptionPreferences.subscriptionFrequencies || "weekly")
    } : {
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

    // Get subscription preferences if user has a subscription
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

    // Serialize user for client components with subscription preferences
    const serializedUser = serializeUser(user, subscriptionPreferences);

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
