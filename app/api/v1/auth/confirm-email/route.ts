import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import confirmEmailAction from "@/app/actions/email/confirmEmail";

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

    const result = await confirmEmailAction(token);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: result.message 
        }),
        { status: result.error === "Email already verified" ? 400 : 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: result.message 
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
