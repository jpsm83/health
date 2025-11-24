import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { reportComment } from "@/app/actions/comment/reportComment";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Report comment
// @route   POST /api/v1/comments/[commentId]/reports
// @access  Private
export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to report comments",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { commentId } = await context.params;
    const { reason } = await req.json();

    if (!commentId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Comment ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!reason) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Report reason is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await reportComment({
      commentId,
      userId: session.user.id,
      reason,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to report comment",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: result.message || "Comment reported successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Report comment failed!", error as string);
  }
};
