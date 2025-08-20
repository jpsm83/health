import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";

// @desc    Send forgot password email
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return new NextResponse(
        JSON.stringify({ 
          message: "If an account with that email exists, a password reset link has been sent." 
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // TODO: Send email with reset link
    // For now, we'll just return the token (in production, send email)
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log("Password reset link:", resetLink); // Remove in production

    // TODO: Replace this with actual email sending logic
    // await sendPasswordResetEmail(user.email, resetLink);

    return new NextResponse(
      JSON.stringify({ 
        message: "If an account with that email exists, a password reset link has been sent.",
        // Remove this in production - only for testing
        resetLink: process.env.NODE_ENV === "development" ? resetLink : undefined
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Forgot password request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
