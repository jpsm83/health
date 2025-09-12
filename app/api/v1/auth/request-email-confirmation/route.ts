import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import requestEmailConfirmation from "@/app/actions/auth/requestEmailConfirmation";

// @desc    Request new email confirmation
// @route   POST /api/v1/auth/request-email-confirmation
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json();

    // Validate required fields
    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email address is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the action to handle email confirmation request
    const result = await requestEmailConfirmation(email);

    if (!result.success) {
      const statusCode = result.error === "Invalid email format" || result.error === "Email already verified" ? 400 : 500;
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
          error: result.error,
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: result.message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Request email confirmation failed!", error as string);
  }
};
