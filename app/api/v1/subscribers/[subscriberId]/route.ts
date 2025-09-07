import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";

// imported models
import Subscriber from "@/app/api/models/subscriber";

// @desc    Get subscriber by subscriberId
// @route   GET /subscribers/[subscriberId]
// @access  Private
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ subscriberId: string }> }
) => {
  try {
    const { subscriberId } = await context.params;
    
    // Validate ObjectId
    if (!isObjectIdValid([subscriberId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid subscriber ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId).lean();

    if (!subscriber) {
      return new NextResponse(JSON.stringify({ message: "Subscriber not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(JSON.stringify(subscriber), {
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

    // Validate ObjectId
    if (!isObjectIdValid([subscriberId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid subscriber ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse JSON body
    const body = await req.json();
    const { subscriptionPreferences } = body;

    // Validate subscription preferences
    if (!subscriptionPreferences || !subscriptionPreferences.categories || !subscriptionPreferences.subscriptionFrequencies) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid subscription preferences format",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      return new NextResponse(JSON.stringify({ message: "Subscriber not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the subscriber belongs to the authenticated user
    if (subscriber.userId?.toString() !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to update this subscriber!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update subscriber preferences
    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      subscriberId,
      { $set: { subscriptionPreferences } },
      {
        new: true,
        lean: true,
      }
    );

    if (!updatedSubscriber) {
      return new NextResponse(JSON.stringify({ message: "Subscriber not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "Subscriber preferences updated successfully",
        data: updatedSubscriber,
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
