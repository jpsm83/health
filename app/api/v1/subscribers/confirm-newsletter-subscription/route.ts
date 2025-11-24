import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";

// Helper function to generate unsubscribe token
function generateUnsubscribeToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// @desc    Confirm newsletter subscription with token
// @route   POST /api/v1/subscribers/confirm-newsletter-subscription
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token, email } = await req.json();

    // Validate required fields
    if (!token || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Token and email are required!",
          error: "MISSING_PARAMETERS",
        },
        { status: 400 }
      );
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
      verificationToken: token,
    });

    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired confirmation link!",
          error: "INVALID_TOKEN",
        },
        { status: 400 }
      );
    }

    // Mark email as verified and clear verification token
    subscriber.emailVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.unsubscribeToken = generateUnsubscribeToken();
    await subscriber.save();

    return NextResponse.json(
      {
        success: true,
        message: "Newsletter subscription confirmed successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return handleApiError("Newsletter subscription confirmation failed!", error as string);
  }
};
