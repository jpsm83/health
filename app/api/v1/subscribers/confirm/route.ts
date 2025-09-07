import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import Subscriber from "@/app/api/models/subscriber";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Confirm newsletter subscription
// @route   POST /subscribers/confirm
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Token and email are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await connectDb();

    const subscriber = await Subscriber.findOne({ 
      email: email.toLowerCase(),
      verificationToken: token,
      isActive: true 
    });

    if (!subscriber) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid or expired confirmation link!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Mark email as verified and clear verification token
    subscriber.emailVerified = true;
    subscriber.verificationToken = undefined;
    await subscriber.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Newsletter subscription confirmed successfully!",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Confirm subscription failed!", error as string);
  }
};

