import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import requestPasswordResetAction from "@/app/actions/auth/requestPasswordReset";

// @desc    Send forgot password email
// @route   POST /api/v1/auth/request-password-reset
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

    // Use the action to handle password reset request
    const result = await requestPasswordResetAction(email);

    if (!result.success) {
      const statusCode = result.error === "Invalid email format" ? 400 : 500;
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
        resetLink: result.resetLink, // Only included in development
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Request password reset failed!", error as string);
  }
};
