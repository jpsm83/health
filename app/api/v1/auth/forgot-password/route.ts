import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import requestPasswordResetAction from "@/app/actions/email/requestPasswordReset";

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

    const result = await requestPasswordResetAction(email);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message,
        resetLink: result.resetLink,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Forgot password route error:", error);
    return handleApiError(
      "Forgot password request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
