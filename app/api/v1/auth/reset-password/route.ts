import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";

// @desc    Request password reset
// @route   POST /auth/reset-password
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse(
        JSON.stringify({
          message: "Email is required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to database
    await connectDb();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return new NextResponse(
        JSON.stringify({
          message: "If an account with that email exists, a password reset link has been sent.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // TODO: Send email with reset link
    // For now, just return the token (in production, send email)
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    return new NextResponse(
      JSON.stringify({
        message: "Password reset link sent to your email.",
        resetLink, // Remove this in production
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Password reset request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
