'use server';

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";

export interface NewsletterUnsubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function unsubscribeFromNewsletterAction(
  email: string,
  token?: string
): Promise<NewsletterUnsubscribeResult> {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required!",
        error: "MISSING_EMAIL"
      };
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({ 
      email: email.toLowerCase()
    });

    if (!subscriber) {
      return {
        success: false,
        message: "Subscriber not found!",
        error: "SUBSCRIBER_NOT_FOUND"
      };
    }

    // If token is provided, validate it
    if (token && subscriber.unsubscribeToken !== token) {
      return {
        success: false,
        message: "Invalid unsubscribe link!",
        error: "INVALID_TOKEN"
      };
    }

    // Deactivate subscription by setting emailVerified to false
    subscriber.emailVerified = false;
    await subscriber.save();

    return {
      success: true,
      message: "Successfully unsubscribed from newsletter!"
    };

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "UNSUBSCRIBE_FAILED"
    };
  }
}
