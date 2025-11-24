import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import { hash } from "bcrypt";

// @desc    Reset password with token (forgot password flow)
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token, newPassword } = await req.json();

    // Validate required fields
    if (!token || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token and new password are required",
          error: "Missing required fields"
        },
        { status: 400 }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be at least 6 characters long",
          error: "Password too short"
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token. Please request a new password reset link.",
          error: "Invalid or expired token"
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully! You can now sign in with your new password."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password failed:', error);
    return handleApiError("Password reset failed!", error as string);
  }
};
