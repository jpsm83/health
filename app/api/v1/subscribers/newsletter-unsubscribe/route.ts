import { NextRequest, NextResponse } from "next/server";
import unsubscribeFromNewsletterAction from "@/app/actions/subscribers/newsletterUnsubscribe";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Unsubscribe from newsletter
// @route   POST /api/v1/subscribers/newsletter-unsubscribe
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email, token } = await req.json();

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

    // Use the action to handle newsletter unsubscription
    const result = await unsubscribeFromNewsletterAction(email, token);

    if (!result.success) {
      const statusCode = result.error === "MISSING_EMAIL" ? 400 : 
                        result.error === "SUBSCRIBER_NOT_FOUND" ? 404 : 
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
    return handleApiError("Newsletter unsubscription failed!", error as string);
  }
};
