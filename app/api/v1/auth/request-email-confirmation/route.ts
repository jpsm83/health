import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import requestEmailConfirmationAction from "@/app/actions/email/requestEmailConfirmation";

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

    const result = await requestEmailConfirmationAction(email);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message,
        }),
        { status: result.error === "Email already verified" ? 400 : 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Request email confirmation route error:", error);
    return handleApiError(
      "Email confirmation request failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
