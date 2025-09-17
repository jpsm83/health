"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";
import { IDeleteCommentParams } from "@/types/comment";

export const deleteComment = async (params: IDeleteCommentParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { commentId, userId, isAdmin = false } = params;

    if (!userId) {
      throw new Error("You must be signed in to delete comments");
    }

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    await connectDb();

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check permissions
    if (!isAdmin && comment.userId.toString() !== userId) {
      throw new Error("You don't have permission to delete this comment");
    }

    // Permanently delete the comment
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      throw new Error("Failed to delete comment");
    }

    // Update article's comment count
    await Article.findByIdAndUpdate(comment.articleId, {
      $inc: { commentsCount: -1 }
    });

    // Check if user has any other comments on this article
    const otherComments = await Comment.findOne({
      articleId: comment.articleId,
      userId: comment.userId,
      _id: { $ne: commentId }
    });

    // If no other comments exist, remove article from user's commentedArticles array
    if (!otherComments) {
      await User.findByIdAndUpdate(comment.userId, {
        $pull: { commentedArticles: comment.articleId }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
};
