import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";
import { sendEmailConfirmation } from "@/services/emailService";

// @desc    Request new email confirmation
// @route   POST /api/v1/auth/request-email-confirmation
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return new NextResponse(
        JSON.stringify({
          message: "Email is required",
        }),
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
            "If an account with that email exists, a confirmation email has been sent.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return new NextResponse(
        JSON.stringify({
          message: "Email is already verified.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update user with new verification token
    await User.findByIdAndUpdate(user._id, {
      verificationToken,
    });

    // Create confirmation link
    const confirmLink = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/confirm-email?token=${verificationToken}`;

    try {
      // Send confirmation email
      await sendEmailConfirmation(
        user.email,
        user.username,
        confirmLink,
        user.preferences?.language || "en"
      );

      return new NextResponse(
        JSON.stringify({
          message:
            "Email confirmation sent successfully. Please check your email.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);

      // Remove the verification token if email failed
      await User.findByIdAndUpdate(user._id, {
        verificationToken: undefined,
      });

      return new NextResponse(
        JSON.stringify({
          message: "Failed to send confirmation email. Please try again later.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Request email confirmation route error:", error);
    return handleApiError(
      "Email confirmation request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
