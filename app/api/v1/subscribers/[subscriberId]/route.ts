import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";

// imported utils
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import Subscriber from "@/app/api/models/subscriber";
import { mainCategories, newsletterFrequencies } from "@/lib/constants";
import { ISerializedSubscriber } from "@/types/subscriber";

// Helper function to serialize MongoDB subscriber object
function serializeSubscriber(subscriber: unknown): ISerializedSubscriber {
  const s = subscriber as {
    _id?: { toString: () => string };
    email: string;
    emailVerified: boolean;
    unsubscribeToken: string;
    userId?: { toString: () => string };
    subscriptionPreferences?: {
      categories?: unknown[];
      subscriptionFrequencies?: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
  };

  return {
    _id: s._id?.toString() || "",
    email: s.email,
    emailVerified: s.emailVerified,
    unsubscribeToken: s.unsubscribeToken,
    userId: s.userId?.toString() || null,
    subscriptionPreferences: {
      categories: (s.subscriptionPreferences?.categories as string[]) || [],
      subscriptionFrequencies:
        s.subscriptionPreferences?.subscriptionFrequencies || "weekly",
    },
    createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: s.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

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
      return NextResponse.json(
        { message: "Invalid subscriber ID format" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId).lean();

    if (!subscriber) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Serialize subscriber for client components
    const serializedSubscriber = serializeSubscriber(subscriber);

    return NextResponse.json(serializedSubscriber, { status: 200 });
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
      return NextResponse.json(
        {
          message: "You must be signed in to update subscriber preferences",
        },
        { status: 401 }
      );
    }

    const { subscriberId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([subscriberId])) {
      return NextResponse.json(
        { message: "Invalid subscriber ID format" },
        { status: 400 }
      );
    }

    // Parse JSON body
    const body = await req.json();
    const { subscriptionPreferences } = body;

    // Validate subscription preferences
    if (
      !subscriptionPreferences ||
      !subscriptionPreferences.categories ||
      !subscriptionPreferences.subscriptionFrequencies
    ) {
      return NextResponse.json(
        { message: "Invalid subscription preferences format" },
        { status: 400 }
      );
    }

    // Validate categories
    if (
      !Array.isArray(subscriptionPreferences.categories) ||
      !subscriptionPreferences.categories.every((cat: string) =>
        mainCategories.includes(cat)
      )
    ) {
      return NextResponse.json(
        { message: "Invalid categories provided" },
        { status: 400 }
      );
    }

    // Validate subscription frequency
    if (
      !newsletterFrequencies.includes(
        subscriptionPreferences.subscriptionFrequencies
      )
    ) {
      return NextResponse.json(
        { message: "Invalid subscription frequency provided" },
        { status: 400 }
      );
    }

    await connectDb();

    // Check if subscriber exists
    const subscriber = await Subscriber.findById(subscriberId);

    if (!subscriber) {
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Check if the subscriber belongs to the authenticated user
    if (subscriber.userId?.toString() !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this subscriber!" },
        { status: 403 }
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
      return NextResponse.json(
        { message: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Serialize subscriber for client components
    const serializedSubscriber = serializeSubscriber(updatedSubscriber);

    return NextResponse.json(
      {
        message: "Subscriber preferences updated successfully",
        data: serializedSubscriber,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(
      "Update subscriber preferences failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
