import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";;
import { toggleCommentLike } from "@/app/actions/comment/toggleCommentLike";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Toggle comment like
// @route   POST /api/v1/comments/[commentId]/likes
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
          message: "You must be signed in to like comments",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { commentId } = await context.params;

    if (!commentId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Comment ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await toggleCommentLike({
      commentId,
      userId: session.user.id,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to toggle comment like",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: {
          liked: result.liked,
          likeCount: result.likeCount,
          message: result.message,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Toggle comment like failed!", error as string);
  }
};
