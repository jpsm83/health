"use server";

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import {
  IGetSubscribersResponse,
  ISerializedSubscriber,
} from "@/interfaces/subscriber";

// Helper function to serialize MongoDB subscriber object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeSubscriber(subscriber: any): ISerializedSubscriber {
  return {
    _id: subscriber._id?.toString() || "",
    email: subscriber.email,
    emailVerified: subscriber.emailVerified,
    unsubscribeToken: subscriber.unsubscribeToken,
    userId: subscriber.userId?.toString() || null,
    subscriptionPreferences: {
      categories: subscriber.subscriptionPreferences?.categories || [],
      subscriptionFrequencies:
        subscriber.subscriptionPreferences?.subscriptionFrequencies || "weekly",
    },
    createdAt: subscriber.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: subscriber.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

export async function getSubscribers(): Promise<IGetSubscribersResponse> {
  try {
    // Connect to database
    await connectDb();

    // Fetch all subscribers excluding verification token
    const subscribers = await Subscriber.find()
      .select("-verificationToken")
      .sort({ createdAt: -1 })
      .lean();

    if (!subscribers || subscribers.length === 0) {
      return {
        success: false,
        message: "No subscribers found!",
      };
    }

    // Serialize subscribers for client components
    const serializedSubscribers = subscribers.map(serializeSubscriber);

    return {
      success: true,
      data: serializedSubscribers,
    };
  } catch (error) {
    console.error("Get subscribers failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get subscribers failed!",
    };
  }
}
