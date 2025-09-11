'use server';

import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import User from "@/app/api/models/user";
import * as nodemailer from "nodemailer";
import { mainCategories } from "@/lib/constants";

// Shared email utilities
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const validateEmailConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error(
      "Email configuration is missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables."
    );
  }
};

const sendEmailWithTransporter = async (mailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}) => {
  const transporter = createTransporter();
  const info = await transporter.sendMail(mailOptions);
  return { success: true, data: { messageId: info.messageId } };
};

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

export interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function subscribeToNewsletterAction(
  email: string,
  preferences: {
    categories?: string[];
    subscriptionFrequencies?: string;
  } = {}
): Promise<NewsletterSubscribeResult> {
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

    // Send confirmation email
    const confirmLink = `${process.env.NEXTAUTH_URL}/confirm-newsletter?token=${subscriber.verificationToken}&email=${encodeURIComponent(subscriber.email)}`;
    const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
    
    try {
      validateEmailConfig();
      
      const emailContent = {
        subject: "Confirm Your Newsletter Subscription - Women Spot",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; color: white;">
                <span style="margin-right: 0.5em;">🤍</span>Women Spot
              </h1>
            </div>
            <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
              <h2 style="color: #374151; margin-bottom: 20px;">Welcome to our community ${email.split('@')[0]}!</h2>
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                Thank you for subscribing to our newsletter! Please confirm your subscription by clicking the button below.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${confirmLink}" style="background-color: #ec4899; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  Confirm Subscription
                </a>
              </div>
              <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
                If you didn't subscribe to our newsletter, please ignore this email.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                If the button above doesn't work, copy and paste this link into your browser:<br>
                <a href="${confirmLink}" style="color: #ec4899;">${confirmLink}</a>
              </p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2025 Women Spot. All rights reserved.</p>
              <p style="margin-top: 10px;">
                If you no longer wish to receive our newsletter, you can 
                <a href="${unsubscribeLink}" style="color: #ec4899; text-decoration: underline;">unsubscribe here</a>.
              </p>
            </div>
          </div>
        `,
        text: `Confirm Your Newsletter Subscription - Women Spot\n\nWelcome to our community ${email.split('@')[0]}!\n\nThank you for subscribing to our newsletter! Please confirm your subscription by clicking the link below.\n\n${confirmLink}\n\nIf you didn't subscribe to our newsletter, please ignore this email.\n\n© 2025 Women Spot. All rights reserved.\n\nIf you no longer wish to receive our newsletter, you can unsubscribe here: ${unsubscribeLink}`
      };

      const mailOptions = {
        from: `"Women Spot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      await sendEmailWithTransporter(mailOptions);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the subscription if email fails
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
