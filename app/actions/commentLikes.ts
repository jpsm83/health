"use server";

import { revalidatePath } from "next/cache";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export const toggleCommentLike = async (
  articleId: string,
  commentId: string,
  userId: string
) => {
  try {
    if (!userId) {
      throw new Error("You must be signed in to like comments");
    }

    await connectDb();

    // Check if user already liked the comment
    const article = await Article.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    const comment = article.comments?.find(
      (comment: { _id: string }) => comment._id.toString() === commentId
    );

    if (!comment) {
      throw new Error("Comment not found");
    }

    const userLiked = comment.commentLikes?.includes(userId);

    // Toggle like status using atomic operation
    const updatedArticle = await Article.findOneAndUpdate(
      {
        _id: articleId,
        "comments._id": commentId,
      },
      userLiked
        ? { $pull: { "comments.$.commentLikes": userId } } // Remove like
        : { $addToSet: { "comments.$.commentLikes": userId } }, // Add like
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error("Failed to update comment like");
    }

    // Find the updated comment to get new like count
    const updatedComment = updatedArticle.comments?.find(
      (comment: { _id: string }) => comment._id.toString() === commentId
    );
    const newLikeCount = updatedComment?.commentLikes?.length || 0;

    // Revalidate the page to show updated like count
    // Fixed: Added 'page' type parameter to avoid warning
    revalidatePath(`/article/[lang]/[slug]`, "page");

    return {
      success: true,
      liked: !userLiked,
      likeCount: newLikeCount,
      message: userLiked ? "Comment unliked" : "Comment liked",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to toggle comment like",
    };
  }
};
