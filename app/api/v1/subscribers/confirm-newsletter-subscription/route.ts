import { NextRequest, NextResponse } from "next/server";
import confirmNewsletterSubscriptionAction from "@/app/actions/subscribers/confirmNewsletterSubscription";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Confirm newsletter subscription with token
// @route   POST /api/v1/subscribers/confirm-newsletter-subscription
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token, email } = await req.json();

    // Validate required fields
    if (!token || !email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Token and email are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the action to handle newsletter subscription confirmation
    const result = await confirmNewsletterSubscriptionAction(token, email);

    if (!result.success) {
      const statusCode = result.error === "MISSING_PARAMETERS" || 
                        result.error === "INVALID_TOKEN" ? 400 : 500;
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
    return handleApiError("Newsletter subscription confirmation failed!", error as string);
  }
};
