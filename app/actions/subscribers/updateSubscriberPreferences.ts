"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import Subscriber from "@/app/api/models/subscriber";
import { mainCategories, newsletterFrequencies } from "@/lib/constants";
import {
  ISerializedSubscriber,
  IUpdateSubscriberPreferencesParams,
  IUpdateSubscriberPreferencesResponse,
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

export async function updateSubscriberPreferences(
  subscriberId: string,
  params: IUpdateSubscriberPreferencesParams,
  sessionUserId: string
): Promise<IUpdateSubscriberPreferencesResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([subscriberId])) {
      return {
        success: false,
        message: "Invalid subscriber ID format",
      };
    }

    const { subscriptionPreferences } = params;

    // Validate subscription preferences
    if (
      !subscriptionPreferences ||
      !subscriptionPreferences.categories ||
      !subscriptionPreferences.subscriptionFrequencies
    ) {
      return {
        success: false,
        message: "Invalid subscription preferences format",
      };
    }

    // Validate categories
    if (
      !Array.isArray(subscriptionPreferences.categories) ||
      !subscriptionPreferences.categories.every((cat) =>
        mainCategories.includes(cat)
      )
    ) {
      return {
        success: false,
        message: "Invalid categories provided",
      };
    }

    // Validate subscription frequency
    if (
      !newsletterFrequencies.includes(
        subscriptionPreferences.subscriptionFrequencies
      )
    ) {
      return {
        success: false,
        message: "Invalid subscription frequency provided",
      };
    }

    // Connect to database
    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }

    // Check if the subscriber belongs to the authenticated user
    if (subscriber.userId?.toString() !== sessionUserId) {
      return {
        success: false,
        message: "You are not authorized to update this subscriber!",
      };
    }

    // Update subscriber preferences
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      { $set: { subscriptionPreferences } },
      {
        new: true,
        lean: true,
      }
    );

    if (!updatedSubscriber) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }

    // Serialize subscriber for client components
    const serializedSubscriber = serializeSubscriber(updatedSubscriber);

    return {
      success: true,
      message: "Subscriber preferences updated successfully",
      data: serializedSubscriber,
    };
  } catch (error) {
    console.error("Update subscriber preferences failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Update subscriber preferences failed!",
    };
  }
}
