import { NextRequest, NextResponse } from "next/server";
import subscribeToNewsletterAction from "@/app/actions/subscribers/newsletterSubscribe";
import unsubscribeFromNewsletterAction from "@/app/actions/subscribers/newsletterUnsubscribe";
import { getSubscribers } from "@/app/actions/subscribers/getSubscribers";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Get all subscribers
// @route   GET /subscribers
// @access  Private (Admin only)
export const GET = async () => {
  try {
    // Use the action to handle getting subscribers
    const result = await getSubscribers();

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        count: result.data?.length || 0,
        data: result.data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Get subscribers failed!", error as string);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /subscribers
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { email, preferences } = await req.json();

    // Validate required fields
    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the action to handle subscription
    const result = await subscribeToNewsletterAction(email, preferences);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
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
    return handleApiError("Subscribe to newsletter failed!", error as string);
  }
};

// @desc    Unsubscribe from newsletter
// @route   DELETE /subscribers
// @access  Public
export const DELETE = async (req: NextRequest) => {
  try {
    const { email, token } = await req.json();

    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the action to handle unsubscription
    const result = await unsubscribeFromNewsletterAction(email, token);

    if (!result.success) {
      const statusCode = result.error === "SUBSCRIBER_NOT_FOUND" ? 404 : 400;
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
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
    return handleApiError("Unsubscribe failed!", error as string);
  }
};
