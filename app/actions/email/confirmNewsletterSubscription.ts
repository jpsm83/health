"use server";

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export interface NewsletterConfirmResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function confirmNewsletterSubscriptionAction(
  token: string,
  email: string
): Promise<NewsletterConfirmResult> {
  try {
    if (!token || !email) {
      return {
        success: false,
        message: "Token and email are required!",
        error: "MISSING_PARAMETERS",
      };
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
      verificationToken: token,
    });

    if (!subscriber) {
      return {
        success: false,
        message: "Invalid or expired confirmation link!",
        error: "INVALID_TOKEN",
      };
    }

    // Mark email as verified and clear verification token
    subscriber.emailVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.unsubscribeToken = generateUnsubscribeToken();
    await subscriber.save();

    return {
      success: true,
      message: "Newsletter subscription confirmed successfully!",
    };
  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "CONFIRMATION_FAILED",
    };
  }
}
