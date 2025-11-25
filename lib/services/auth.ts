import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import crypto from "crypto";
import { hash } from "bcrypt";
import mongoose from "mongoose";

export interface RequestEmailConfirmationResult {
  user: {
    _id: string;
    username: string;
    email: string;
    preferences?: {
      language?: string;
    };
  } | null;
  verificationToken: string;
}

export async function requestEmailConfirmationService(
  email: string
): Promise<RequestEmailConfirmationResult> {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  await connectDb();

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    // Return null user but don't throw - security: don't reveal if user exists
    return {
      user: null,
      verificationToken: "",
    };
  }

  // Check if email is already verified
  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }

  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // Update user with new verification token
  await User.findByIdAndUpdate(user._id, {
    verificationToken,
  });

  return {
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      preferences: user.preferences as { language?: string } | undefined,
    },
    verificationToken,
  };
}

export async function confirmEmailService(token: string): Promise<void> {
  if (!token || token.trim() === "") {
    throw new Error("Verification token is required");
  }

  await connectDb();

  // Find user with valid verification token
  const user = await User.findOne({
    verificationToken: token,
  });

  if (!user) {
    throw new Error("Invalid verification token. Please request a new confirmation link.");
  }

  // Check if email is already verified
  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }

  // Start database transaction to update both user and subscriber
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update user to mark email as verified and clear verification token
    await User.findByIdAndUpdate(
      user._id,
      {
        emailVerified: true,
        verificationToken: undefined,
      },
      { session }
    );

    // Also update linked subscriber's email verification status
    if (user.subscriptionId) {
      await Subscriber.findByIdAndUpdate(
        user.subscriptionId,
        {
          emailVerified: true,
        },
        { session }
      );
    }

    // Commit the transaction
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
}

export interface RequestPasswordResetResult {
  user: {
    _id: string;
    username: string;
    email: string;
    preferences?: {
      language?: string;
    };
  } | null;
  resetToken: string;
  resetTokenExpiry: Date;
}

export async function requestPasswordResetService(
  email: string
): Promise<RequestPasswordResetResult> {
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  await connectDb();

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    // Return null user but don't throw - security: don't reveal if user exists
    return {
      user: null,
      resetToken: "",
      resetTokenExpiry: new Date(),
    };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Save reset token to user
  await User.findByIdAndUpdate(user._id, {
    resetPasswordToken: resetToken,
    resetPasswordExpires: resetTokenExpiry,
  });

  return {
    user: {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      preferences: user.preferences as { language?: string } | undefined,
    },
    resetToken,
    resetTokenExpiry,
  };
}

export async function resetPasswordService(
  token: string,
  newPassword: string
): Promise<void> {
  if (!token || !newPassword) {
    throw new Error("Reset token and new password are required");
  }

  // Validate new password length
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  await connectDb();

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Token not expired
  });

  if (!user) {
    throw new Error("Invalid or expired reset token. Please request a new password reset link.");
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, 10);

  // Update password and clear reset token
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetPasswordToken: undefined,
    resetPasswordExpires: undefined,
  });
}

