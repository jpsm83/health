import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";

// @desc    Reset password with token (forgot password flow)
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    // Validate required fields
    if (!token || !newPassword) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Reset token and new password are required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return new NextResponse(
        JSON.stringify({ 
          message: "New password must be at least 6 characters long" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Invalid or expired reset token. Please request a new password reset link." 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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

    return new NextResponse(
      JSON.stringify({ 
        message: "Password reset successfully. You can now sign in with your new password." 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Password reset failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
