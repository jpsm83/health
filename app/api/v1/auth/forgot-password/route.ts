import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";
import { sendPasswordResetEmail } from "@/lib/utils/emailService";

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
          message:
            "If an account with that email exists, a password reset link has been sent.",
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

    // Create reset link
    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    try {
      // Check email configuration
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error("Email configuration missing:", {
          hasUser: !!process.env.EMAIL_USER,
          hasPassword: !!process.env.EMAIL_PASSWORD,
        });
        throw new Error("Email configuration is missing");
      }

      // Send password reset email
      await sendPasswordResetEmail(user.email, user.username, resetLink);

      return new NextResponse(
        JSON.stringify({
          message:
            "If an account with that email exists, a password reset link has been sent.",
          // Remove this in production - only for testing
          resetLink:
            process.env.NODE_ENV === "development" ? resetLink : undefined,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);

      // Remove the reset token if email failed
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      });

      return new NextResponse(
        JSON.stringify({
          message:
            "Failed to send password reset email. Please try again later.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Forgot password route error:", error);
    return handleApiError(
      "Forgot password request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
