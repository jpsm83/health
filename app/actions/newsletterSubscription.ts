"use server";

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import User from "@/app/api/models/user";
import { sendEmail } from "@/services/emailService";
import { mainCategories } from "@/lib/constants";

// Helper function to generate verification token
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function subscribeToNewsletter(
  email: string,
  preferences: {
    categories?: string[];
    subscriptionFrequencies?: string;
  } = {}
): Promise<NewsletterSubscriptionResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address!",
        error: "INVALID_EMAIL"
      };
    }

    await connectDb();

    // Check if user already has an account (to prevent duplicate subscriptions)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return {
        success: false,
        message: "This email is already registered. Please manage your newsletter preferences in your profile.",
        error: "USER_EXISTS"
      };
    }

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      if (subscriber.emailVerified) {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter!",
          error: "ALREADY_SUBSCRIBED"
        };
      } else {
        // Reactivate existing subscriber
        subscriber.emailVerified = false;
        subscriber.verificationToken = generateVerificationToken();
        subscriber.unsubscribeToken = generateUnsubscribeToken();
        subscriber.subscriptionPreferences = {
          categories: preferences?.categories || mainCategories,
          subscriptionFrequencies: preferences?.subscriptionFrequencies || "weekly",
        };
        await subscriber.save();
      }
    } else {
      // Create new subscriber
      const subscriberData = {
        email: email.toLowerCase(),
        userId: null, // No user account yet
        subscriptionPreferences: {
          categories: preferences?.categories || mainCategories,
          subscriptionFrequencies: preferences?.subscriptionFrequencies || "weekly",
        },
        verificationToken: generateVerificationToken(),
        unsubscribeToken: generateUnsubscribeToken(),
      };

      subscriber = await Subscriber.create(subscriberData);
    }

    // Send confirmation email only if email is valid
    const confirmLink = `${process.env.NEXTAUTH_URL}/confirm-newsletter?token=${subscriber.verificationToken}&email=${encodeURIComponent(subscriber.email)}`;
    const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
    
    // Double-check email validity before sending
    if (emailRegex.test(email)) {
      try {
        await sendEmail(
          email,
          'newsletterConfirmation',
          { 
            confirmLink, 
            username: email.split('@')[0], // Use email prefix as username
            locale: 'en', // Default to English for newsletter confirmation
            unsubscribeLink
          }
        );
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the subscription if email fails
      }
    } else {
      console.error("Invalid email format detected before sending:", email);
      // Don't send email for invalid addresses
    }

    return {
      success: true,
      message: "Please check your email to confirm your subscription!"
    };

  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "SUBSCRIPTION_FAILED"
    };
  }
}

export async function confirmNewsletterSubscription(
  token: string,
  email: string
): Promise<NewsletterSubscriptionResult> {
  try {
    if (!token || !email) {
      return {
        success: false,
        message: "Token and email are required!",
        error: "MISSING_PARAMETERS"
      };
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({ 
      email: email.toLowerCase(),
      verificationToken: token
    });

    if (!subscriber) {
      return {
        success: false,
        message: "Invalid or expired confirmation link!",
        error: "INVALID_TOKEN"
      };
    }

    // Mark email as verified and clear verification token
    subscriber.emailVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.unsubscribeToken = generateUnsubscribeToken();
    await subscriber.save();

    return {
      success: true,
      message: "Newsletter subscription confirmed successfully!"
    };

  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
      error: "CONFIRMATION_FAILED"
    };
  }
}

export async function unsubscribeFromNewsletter(
  email: string,
  token?: string
): Promise<NewsletterSubscriptionResult> {
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
