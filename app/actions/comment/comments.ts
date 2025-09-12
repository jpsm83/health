"use server";

import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { IArticleComment } from "@/interfaces/article";

export const createComment = async (articleId: string, comment: string, userId: string) => {
  let commentSaved = false;
  let savedComment = null;

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

    // First check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if user is the author
    if (article.createdBy?.toString() === userId) {
      throw new Error("You cannot comment on your own article");
    }

    // Check if user has already commented
    const hasCommented = article.comments?.some(
      (comment: IArticleComment) => comment.userId?.toString() === userId
    );
    if (hasCommented) {
      throw new Error("You have already commented on this article");
    }

    // Add comment to article
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
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
      throw new Error("Failed to add comment to article");
    }

    // Mark that comment was saved successfully
    commentSaved = true;
    const lastComment = updatedArticle.comments[updatedArticle.comments.length - 1];
    savedComment = {
      _id: lastComment._id?.toString(),
      userId: lastComment.userId?.toString(),
      comment: lastComment.comment,
      commentLikes: [],
      commentReports: [],
      createdAt: lastComment.createdAt?.toISOString(),
      updatedAt: lastComment.updatedAt?.toISOString(),
    };

    return {
      success: true,
      comment: savedComment,
    };
  } catch (error) {
    console.error("Error in createComment:", error);
    
    // If comment was saved but there was an error after, still return success
    if (commentSaved && savedComment) {
      return {
        success: true,
        comment: savedComment,
      };
    }
    
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

    // Temporarily disable revalidatePath to fix stack overflow
    // revalidatePath(`/[locale]/[category]/[slug]`, "page");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
};
