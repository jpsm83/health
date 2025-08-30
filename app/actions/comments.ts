"use server";

import { revalidatePath } from "next/cache";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export const createComment = async (articleId: string, comment: string, userId: string) => {
  try {
    if(!userId) {
      throw new Error("You must be signed in to comment");
    }
    // Validate comment before DB call
    const trimmed = comment.trim();
    if (!trimmed) {
      throw new Error("Comment cannot be empty");
    }
    if (trimmed.length > 600) {
      throw new Error("Comment cannot be longer than 600 characters");
    }
    if (trimmed.includes("http")) {
      throw new Error("Comment cannot contain links");
    }

    await connectDb();

    // Single atomic operation: ensure article exists & user hasn't commented yet
    const updatedArticle = await Article.findOneAndUpdate(
      {
        _id: articleId,
        createdBy: { $ne: userId }, // prevent self-comment
        "comments.userId": { $ne: userId }, // prevent duplicates
      },
      {
        $push: {
          comments: {
            userId: userId,
            comment: trimmed,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error(
        "Article not found, you are the author, or you have already commented!"
      );
    }

    revalidatePath(`/article/[lang]/[slug]`);

    return {
      success: true,
      comment: updatedArticle.comments[updatedArticle.comments.length - 1],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add comment",
    };
  }
};

export const deleteComment = async (articleId: string, commentId: string, userId: string) => {
  try {
    if (!userId) {
      throw new Error("You must be signed in to delete comments");
    }

    await connectDb();

    // Delete in one query, ensuring user owns the comment
    const updatedArticle = await Article.findOneAndUpdate(
      {
        _id: articleId,
        "comments._id": commentId,
        "comments.userId": userId,
      },
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error(
        "Comment not found or you don't have permission to delete it"
      );
    }

    revalidatePath(`/article/[lang]/[slug]`);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
};
