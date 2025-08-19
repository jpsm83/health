import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";

// @desc    Confirm password reset
// @route   POST /auth/reset-password/confirm
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return new NextResponse(
        JSON.stringify({
          message: "Token and new password are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (newPassword.length < 6) {
      return new NextResponse(
        JSON.stringify({
          message: "Password must be at least 6 characters long!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to database
    await connectDb();

    // Find user by reset token and check expiry
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid or expired reset token!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 10);

    // Update user password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      updatedAt: new Date(),
    });

    return new NextResponse(
      JSON.stringify({
        message: "Password reset successfully!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Password reset confirmation failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
