'use server';

import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import mongoose from "mongoose";

export interface ConfirmEmailResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function confirmEmailAction(
  token: string
): Promise<ConfirmEmailResult> {
  try {
    // Validate token
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: "Verification token is required",
        error: "Missing token"
      };
    }

    await connectDb();

    // Find user with valid verification token
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid verification token. Please request a new confirmation link.",
        error: "Invalid token"
      };
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return {
        success: false,
        message: "Email is already verified.",
        error: "Email already verified"
      };
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

      return {
        success: true,
        message: "Email confirmed successfully! You can now sign in to your account."
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    console.error('Confirm email action failed:', error);
    return {
      success: false,
      message: "Email confirmation failed",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
