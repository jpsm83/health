import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// @desc    Delete comment
// @route   DELETE /api/v1/comments/[commentId]
// @access  Private
export const DELETE = async (
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to delete comments",
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

    // Check permissions
    const isAdmin = session.user.role === "admin";
    if (!isAdmin && comment.userId.toString() !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You don't have permission to delete this comment",
        },
        { status: 403 }
      );
    }

    // Permanently delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json(
        { success: false, message: "Failed to delete comment" },
        { status: 500 }
      );
    }

    // Update article's comment count
    await Article.findByIdAndUpdate(comment.articleId, {
      $inc: { commentsCount: -1 },
    });

    // Check if user has any other comments on this article
    const otherComments = await Comment.findOne({
      articleId: comment.articleId,
      userId: comment.userId,
      _id: { $ne: commentId },
    });

    // If no other comments exist, remove article from user's commentedArticles array
    if (!otherComments) {
      await User.findByIdAndUpdate(comment.userId, {
        $pull: { commentedArticles: comment.articleId },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Delete comment failed!", error as string);
  }
};
