import { auth } from "../../../../auth/[...nextauth]/auth";
import { NextResponse } from "next/server";
import isObjectIdValid from "../../../../../utils/isObjectIdValid";
import { toggleCommentLike } from "@/app/actions/commentLikes";

// @desc    Toggle comment like (add if not liked, remove if already liked)
// @route   POST /test-actions/comment-likes/[articleId]/[commentId]
// @access  Private
export const POST = async (
  req: Request,
  context: { params: Promise<{ articleId: string; commentId: string }> }
) => {
  const { articleId, commentId } = await context.params;

  // Validate ObjectIds
  if (!isObjectIdValid([articleId, commentId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID or comment ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // User must be signed in to toggle likes
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to toggle comment likes",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const result = await toggleCommentLike(articleId, commentId);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
