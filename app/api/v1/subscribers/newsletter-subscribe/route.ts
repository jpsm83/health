import { NextRequest, NextResponse } from "next/server";
import subscribeToNewsletterAction from "@/app/actions/subscribers/newsletterSubscribe";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Subscribe to newsletter
// @route   POST /api/v1/subscribers/newsletter-subscribe
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email, preferences } = await req.json();

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

    // Use the action to handle newsletter subscription
    const result = await subscribeToNewsletterAction(email, preferences);

    if (!result.success) {
      const statusCode = result.error === "INVALID_EMAIL" || 
                        result.error === "USER_EXISTS" || 
                        result.error === "ALREADY_SUBSCRIBED" || 
                        result.error === "INVALID_EMAIL_ADDRESS" || 
                        result.error === "EMAIL_BOUNCED" ? 400 : 500;
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
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Newsletter subscription failed!", error as string);
  }
};
