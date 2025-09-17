"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import { IToggleCommentLikeParams } from "@/types/comment";
import { Types } from "mongoose";

export const toggleCommentLike = async (params: IToggleCommentLikeParams): Promise<{
  success: boolean;
  liked?: boolean;
  likeCount?: number;
  message?: string;
  error?: string;
}> => {
  try {
    const { commentId, userId } = params;

    if (!userId) {
      throw new Error("You must be signed in to like comments");
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

    if (comment.isDeleted) {
      throw new Error("Cannot like a deleted comment");
    }

    // Check if user already liked the comment
    const userLiked = comment.likes?.includes(new Types.ObjectId(userId));

    // Toggle like status using atomic operation
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      userLiked
        ? { $pull: { likes: new Types.ObjectId(userId) } } // Remove like
        : { $addToSet: { likes: new Types.ObjectId(userId) } }, // Add like
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Failed to update comment like");
    }

    const newLikeCount = updatedComment.likes?.length || 0;

    return {
      success: true,
      liked: !userLiked,
      likeCount: newLikeCount,
      message: userLiked ? "Comment unliked" : "Comment liked",
    };
  } catch (error) {
    console.error("Error in toggleCommentLike:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle comment like",
    };
  }
};
