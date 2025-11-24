import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import mongoose from "mongoose";

// @desc    Confirm email with verification token
// @route   POST /api/v1/auth/confirm-email
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token } = await req.json();

    // Validate required fields
    if (!token || token.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token is required",
          error: "Missing token"
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Find user with valid verification token
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification token. Please request a new confirmation link.",
          error: "Invalid token"
        },
        { status: 400 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already verified.",
          error: "Email already verified"
        },
        { status: 400 }
      );
    }

    // Start database transaction to update both user and subscriber
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update user to mark email as verified and clear verification token
      await User.findByIdAndUpdate(user._id, {
        emailVerified: true,
        verificationToken: undefined,
      }, { session });

      // Also update linked subscriber's email verification status
      if (user.subscriptionId) {
        await Subscriber.findByIdAndUpdate(user.subscriptionId, {
          emailVerified: true,
        }, { session });
      }

      // Commit the transaction
      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: "Email confirmed successfully! You can now sign in to your account."
        },
        { status: 200 }
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Confirm email failed:', error);
    return handleApiError("Email confirmation failed!", error as string);
  }
};
