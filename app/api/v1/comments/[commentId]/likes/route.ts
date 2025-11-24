import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import { Types } from "mongoose";

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
      return NextResponse.json(
        {
          success: false,
          message: "Comment ID is required",
        },
        { status: 400 }
      );
    }

    await connectDb();

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.isDeleted) {
      return NextResponse.json(
        { success: false, message: "Cannot like a deleted comment" },
        { status: 400 }
      );
    }

    // Check if user already liked the comment
    const userLiked = comment.likes?.includes(new Types.ObjectId(session.user.id));

    // Toggle like status using atomic operation
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      userLiked
        ? { $pull: { likes: new Types.ObjectId(session.user.id) } } // Remove like
        : { $addToSet: { likes: new Types.ObjectId(session.user.id) } }, // Add like
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json(
        { success: false, message: "Failed to update comment like" },
        { status: 500 }
      );
    }

    const newLikeCount = updatedComment.likes?.length || 0;

    return NextResponse.json(
      {
        success: true,
        data: {
          liked: !userLiked,
          likeCount: newLikeCount,
          message: userLiked ? "Comment unliked" : "Comment liked",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Toggle comment like failed!", error as string);
  }
};
