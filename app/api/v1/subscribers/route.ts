import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import { sendEmail } from "@/services/emailService";
import { mainCategories } from "@/lib/constants";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Get all subscribers
// @route   GET /subscribers
// @access  Private (Admin only)
export const GET = async () => {
  try {
    await connectDb();

    const subscribers = await Subscriber.find({ emailVerified: true })
      .select("-verificationToken")
      .sort({ createdAt: -1 });

    return new NextResponse(
      JSON.stringify({
        success: true,
        count: subscribers.length,
        data: subscribers,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Get subscribers failed!", error as string);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /subscribers
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    // Validate required fields
    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please enter a valid email address!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDb();

    // Send confirmation email
    const confirmLink = `${
      process.env.NEXTAUTH_URL
    }/confirm-newsletter?token=${generateVerificationToken()}&email=${encodeURIComponent(
      email
    )}`;
    const unsubscribeLink = `${
      process.env.NEXTAUTH_URL
    }/unsubscribe?email=${encodeURIComponent(email)}`;

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber && !existingSubscriber.userId) {
      if (existingSubscriber.emailVerified) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "This email is already subscribed to our newsletter!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else {
        // Reactivate existing subscriber
        existingSubscriber.emailVerified = false;
        existingSubscriber.verificationToken = generateVerificationToken();
        await Subscriber.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            emailVerified: false,
            verificationToken: existingSubscriber.verificationToken,
          },
          { new: true }
        );
        try {
          await sendEmail(email, "newsletterConfirmation", {
            confirmLink,
            username: email.split("@")[0], // Use email prefix as username
            locale: "en", // Default to English for newsletter confirmation
            unsubscribeLink,
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the subscription if email fails
        }
      }
    }

    await Subscriber.create({
      email: email.toLowerCase(),
      verificationToken: generateVerificationToken(),
      unsubscribeToken: generateVerificationToken(),
      subscriptionPreferences: {
        categories: mainCategories,
        subscriptionFrequencies: "weekly",
      },
    });

    try {
      await sendEmail(email, "newsletterConfirmation", {
        confirmLink,
        username: email.split("@")[0], // Use email prefix as username
        locale: "en", // Default to English for newsletter confirmation
        unsubscribeLink,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the subscription if email fails
    }

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Please check your email to confirm your subscription!",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
  } catch (error) {
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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (!subscriber) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Subscriber not found!",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (subscriber.userId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message:
            "Subscriber is linked to a user! Deactivate the user instead.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // If token is provided, validate it
    if (token && subscriber.unsubscribeToken !== token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid unsubscribe link!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Deactivate subscription by setting emailVerified to false
    subscriber.emailVerified = false;
    await subscriber.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Successfully unsubscribed from newsletter!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Unsubscribe failed!", error as string);
  }
};

// Helper function to generate verification token
function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
