import { NextResponse } from "next/server";
import sendNewsletterAction from "@/app/actions/newsletter/sendNewsletter";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Send newsletter to all subscribers
// @route   POST /api/v1/newsletter/send-newsletter
// @access  Private (Admin only)
export const POST = async () => {
  try {
    // Use the action to handle newsletter sending
    const result = await sendNewsletterAction();

    // Return 200 for both success and "no subscribers" cases
    if (!result.success && result.error === "NO_SUBSCRIBERS") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
          error: result.error,
          sentCount: 0
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
          error: result.error,
          sentCount: result.sentCount || 0
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: result.message,
        sentCount: result.sentCount
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Newsletter sending failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
