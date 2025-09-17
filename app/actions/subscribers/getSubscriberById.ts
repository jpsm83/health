"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import Subscriber from "@/app/api/models/subscriber";
import {
  IGetSubscriberByIdResponse,
  ISerializedSubscriber,
} from "@/types/subscriber";

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

export async function getSubscriberById(
  subscriberId: string
): Promise<IGetSubscriberByIdResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([subscriberId])) {
      return {
        success: false,
        message: "Invalid subscriber ID format",
      };
    }

    // Connect to database
    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId).lean();

    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }

    // Serialize subscriber for client components
    const serializedSubscriber = serializeSubscriber(subscriber);

    return {
      success: true,
      data: serializedSubscriber,
    };
  } catch (error) {
    console.error("Get subscriber by ID failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Get subscriber by ID failed!",
    };
  }
}
