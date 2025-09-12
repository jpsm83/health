'use server';

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import User from "@/app/api/models/user";

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
    
    // Try to find subscriber with different email formats
    const subscriber = await Subscriber.findOne({ 
      email: email.toLowerCase()
    });
    
    let finalSubscriber = subscriber;
    
    if (!subscriber) {
      // Try to find with original email case
      const subscriberOriginalCase = await Subscriber.findOne({ 
        email: email
      });
      
      if (subscriberOriginalCase) {
        finalSubscriber = subscriberOriginalCase;
      } else {
        return {
          success: false,
          message: "Subscriber not found!",
          error: "SUBSCRIBER_NOT_FOUND"
        };
      }
    }

    // If token is provided, validate it
    if (token && finalSubscriber.unsubscribeToken !== token) {
      return {
        success: false,
        message: "Invalid unsubscribe link!",
        error: "INVALID_TOKEN"
      };
    }

    // Check if subscriber has a linked user account by email
    const actualUser = await User.findOne({ email: email.toLowerCase() });
    const hasUserAccount = !!actualUser;
    
    if (hasUserAccount) {
      // User has account - only deactivate subscription (don't delete data)
      finalSubscriber.emailVerified = false;
      await finalSubscriber.save();
      
      return {
        success: true,
        message: "Successfully unsubscribed from newsletter! You can manage your preferences in your profile."
      };
    } else {
      // No user account - delete all subscriber data
      await Subscriber.findByIdAndDelete(finalSubscriber._id);
      
      return {
        success: true,
        message: "Successfully unsubscribed from newsletter! All your data has been removed."
      };
    }

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "UNSUBSCRIBE_FAILED"
    };
  }
}
