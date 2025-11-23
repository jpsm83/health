import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/auth";

// imported utils
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported actions
import { getSubscriberById } from "@/app/actions/subscribers/getSubscriberById";
import { updateSubscriberPreferences } from "@/app/actions/subscribers/updateSubscriberPreferences";

// @desc    Get subscriber by subscriberId
// @route   GET /subscribers/[subscriberId]
// @access  Private
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ subscriberId: string }> }
) => {
  try {
    const { subscriberId } = await context.params;

    // Use the action to handle getting subscriber by ID
    const result = await getSubscriberById(subscriberId);

    if (!result.success) {
      const statusCode =
        result.message === "Invalid subscriber ID format" ? 400 : 404;
      return new NextResponse(JSON.stringify({ message: result.message }), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError(
      "Get subscriber by subscriberId failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

// @desc    Update subscriber preferences
// @route   PATCH /subscribers/[subscriberId]
// @access  Private
export const PATCH = async (
  req: Request,
  context: { params: Promise<{ subscriberId: string }> }
) => {
  try {
    // validate session
    const session = await auth();

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to update subscriber preferences",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { subscriberId } = await context.params;

    // Parse JSON body
    const body = await req.json();
    const { subscriptionPreferences } = body;

    // Use the action to handle updating subscriber preferences
    const result = await updateSubscriberPreferences(
      subscriberId,
      { subscriptionPreferences },
      session.user.id
    );

    if (!result.success) {
      const statusCode =
        result.message === "Invalid subscriber ID format"
          ? 400
          : result.message === "Subscriber not found"
          ? 404
          : result.message ===
            "You are not authorized to update this subscriber!"
          ? 403
          : result.message?.includes("Invalid")
          ? 400
          : 500;

      return new NextResponse(
        JSON.stringify({
          message: result.message,
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message,
        data: result.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Update subscriber preferences failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
