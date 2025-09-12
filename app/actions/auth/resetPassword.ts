'use server';

import { hash } from "bcrypt";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";

export interface ResetPasswordResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    // Validate required fields
    if (!token || !newPassword) {
      return {
        success: false,
        message: "Reset token and new password are required",
        error: "Missing required fields"
      };
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return {
        success: false,
        message: "New password must be at least 6 characters long",
        error: "Password too short"
      };
    }

    await connectDb();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset link.",
        error: "Invalid or expired token"
      };
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return {
      success: true,
      message: "Password reset successfully! You can now sign in with your new password."
    };
  } catch (error) {
    console.error('Reset password action failed:', error);
    return {
      success: false,
      message: "Password reset failed",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
