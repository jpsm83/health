import { NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";

// @desc    Confirm email with verification token
// @route   POST /api/v1/auth/confirm-email
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { token } = body;

    // Validate required fields
    if (!token) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Verification token is required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Find user with valid verification token
    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Invalid verification token. Please request a new confirmation link." 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Email is already verified." 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update user to mark email as verified and clear verification token
    await User.findByIdAndUpdate(user._id, {
      emailVerified: true,
      verificationToken: undefined,
    });

    return new NextResponse(
      JSON.stringify({ 
        message: "Email confirmed successfully! You can now sign in to your account." 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Email confirmation failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
