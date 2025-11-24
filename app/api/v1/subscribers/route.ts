import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import User from "@/app/api/models/user";
import { ISerializedSubscriber } from "@/types/subscriber";
import * as nodemailer from "nodemailer";
import { mainCategories } from "@/lib/constants";

// Helper function to serialize MongoDB subscriber object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeSubscriber(subscriber: unknown): ISerializedSubscriber {
  const s = subscriber as {
    _id?: { toString: () => string };
    email: string;
    emailVerified: boolean;
    unsubscribeToken: string;
    userId?: { toString: () => string };
    subscriptionPreferences?: {
      categories?: unknown[];
      subscriptionFrequencies?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  };

  return {
    _id: s._id?.toString() || "",
    email: s.email,
    emailVerified: s.emailVerified,
    unsubscribeToken: s.unsubscribeToken,
    userId: s.userId?.toString() || null,
    subscriptionPreferences: {
      categories: s.subscriptionPreferences?.categories || [],
      subscriptionFrequencies:
        s.subscriptionPreferences?.subscriptionFrequencies || "weekly",
    },
    createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

// @desc    Get all subscribers
// @route   GET /subscribers
// @access  Private (Admin only)
export const GET = async () => {
  try {
    await connectDb();

    // Fetch all subscribers excluding verification token
    const subscribers = await Subscriber.find()
      .select("-verificationToken")
      .sort({ createdAt: -1 })
      .lean();

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No subscribers found!",
        },
        { status: 404 }
      );
    }

    // Serialize subscribers for client components
    const serializedSubscribers = subscribers.map(serializeSubscriber);

    return NextResponse.json(
      {
        success: true,
        count: serializedSubscribers.length,
        data: serializedSubscribers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get subscribers failed:", error);
    return handleApiError("Get subscribers failed!", error as string);
  }
};

// Email validation function
const validateEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    // Extract domain from email
    const domain = email.split('@')[1];
    
    // Check if it's a common disposable email domain
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];
    
    if (disposableDomains.includes(domain.toLowerCase())) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Email validation error:', error);
    return false;
  }
};

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

// @desc    Subscribe to newsletter
// @route   POST /subscribers
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email, preferences } = await req.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required!",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address!",
          error: "INVALID_EMAIL"
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if user already has an account (to prevent duplicate subscriptions)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is already registered. Please manage your newsletter preferences in your profile.",
          error: "USER_EXISTS"
        },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    let subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (subscriber) {
      // Update existing subscriber preferences and resend confirmation
      subscriber.emailVerified = false;
      subscriber.verificationToken = generateVerificationToken();
      subscriber.unsubscribeToken = generateUnsubscribeToken();
      subscriber.subscriptionPreferences = {
        categories: preferences?.categories || mainCategories,
        subscriptionFrequencies: preferences?.subscriptionFrequencies || "weekly",
      };
      await subscriber.save();
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

    // Validate email before sending confirmation
    const isEmailValid = await validateEmailExists(subscriber.email);
    if (!isEmailValid) {
      // Remove the subscriber record if email is invalid
      await Subscriber.findByIdAndDelete(subscriber._id);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address. Please use a valid email address.",
          error: "INVALID_EMAIL_ADDRESS"
        },
        { status: 400 }
      );
    }

    // Send confirmation email
    const confirmLink = `${process.env.NEXTAUTH_URL}/confirm-newsletter?token=${subscriber.verificationToken}&email=${encodeURIComponent(subscriber.email)}`;
    const unsubscribeLink = `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
    
    try {
      validateEmailConfig();
      
      const emailContent = {
        subject: "Confirm Your Newsletter Subscription - Women's Spot",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #ec4899; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 24px; color: white;">
                <span style="margin-right: 0.5em;">🤍</span>Women&apos;s Spot
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
              <p>© 2025 Women&apos;s Spot. All rights reserved.</p>
              <p style="margin-top: 10px;">
                If you no longer wish to receive our newsletter, you can 
                <a href="${unsubscribeLink}" style="color: #ec4899; text-decoration: underline;">unsubscribe here</a>.
              </p>
            </div>
          </div>
        `,
        text: `Confirm Your Newsletter Subscription - Women's Spot\n\nWelcome to our community ${email.split('@')[0]}!\n\nThank you for subscribing to our newsletter! Please confirm your subscription by clicking the link below.\n\n${confirmLink}\n\nIf you didn't subscribe to our newsletter, please ignore this email.\n\n© 2025 Women's Spot. All rights reserved.\n\nIf you no longer wish to receive our newsletter, you can unsubscribe here: ${unsubscribeLink}`
      };

      const mailOptions = {
        from: `"Women's Spot" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      };

      await sendEmailWithTransporter(mailOptions);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      
      // Check if it's a bounce error (email doesn't exist)
      const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
      if (errorMessage.includes('bounce') || 
          errorMessage.includes('invalid') || 
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist')) {
        
        // Remove the subscriber record if email bounces
        await Subscriber.findByIdAndDelete(subscriber._id);
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email address. Please use a valid email address.",
            error: "EMAIL_BOUNCED"
          },
          { status: 400 }
        );
      }
      
      // For other email errors, don't fail the subscription but log the error
      console.error("Email sending failed but subscription will continue:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Please check your email to confirm your subscription!"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return handleApiError("Subscribe to newsletter failed!", error as string);
  }
};

// @desc    Unsubscribe from newsletter
// @route   DELETE /subscribers
// @access  Public
export const DELETE = async (req: NextRequest) => {
  try {
    const { email, token } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required!",
          error: "MISSING_EMAIL"
        },
        { status: 400 }
      );
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
        return NextResponse.json(
          {
            success: false,
            message: "Subscriber not found!",
            error: "SUBSCRIBER_NOT_FOUND"
          },
          { status: 404 }
        );
      }
    }

    // If token is provided, validate it
    if (token && finalSubscriber.unsubscribeToken !== token) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid unsubscribe link!",
          error: "INVALID_TOKEN"
        },
        { status: 400 }
      );
    }

    // Check if subscriber has a linked user account by email
    const actualUser = await User.findOne({ email: email.toLowerCase() });
    const hasUserAccount = !!actualUser;
    
    if (hasUserAccount) {
      // User has account - only deactivate subscription (don't delete data)
      finalSubscriber.emailVerified = false;
      await finalSubscriber.save();
      
      return NextResponse.json(
        {
          success: true,
          message: "Successfully unsubscribed from newsletter! You can manage your preferences in your profile."
        },
        { status: 200 }
      );
    } else {
      // No user account - delete all subscriber data
      await Subscriber.findByIdAndDelete(finalSubscriber._id);
      
      return NextResponse.json(
        {
          success: true,
          message: "Successfully unsubscribed from newsletter! All your data has been removed."
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return handleApiError("Unsubscribe failed!", error as string);
  }
};
