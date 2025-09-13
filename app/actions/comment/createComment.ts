"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import Article from "@/app/api/models/article";
import { ICreateCommentParams, ISerializedComment } from "@/interfaces/comment";
import { Types } from "mongoose";

export const createComment = async (params: ICreateCommentParams): Promise<{
  success: boolean;
  comment?: ISerializedComment;
  error?: string;
}> => {
  try {
    const { articleId, userId, comment } = params;

    // Validation
    if (!userId) {
      throw new Error("You must be signed in to comment");
    }
    
    if (!articleId) {
      throw new Error("Article ID is required");
    }

    const trimmed = comment.trim();
    if (!trimmed) {
      throw new Error("Comment cannot be empty");
    }
    if (trimmed.length > 1000) {
      throw new Error("Comment cannot be longer than 1000 characters");
    }
    if (trimmed.includes("http")) {
      throw new Error("Comment cannot contain links");
    }

    await connectDb();

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    // Check if user is the author
    if (article.createdBy?.toString() === userId) {
      throw new Error("You cannot comment on your own article");
    }

    // Check if user has already commented on this article
    const existingComment = await Comment.findOne({
      articleId: new Types.ObjectId(articleId),
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    });

    if (existingComment) {
      throw new Error("You have already commented on this article");
    }

    // Create new comment
    const newComment = new Comment({
      articleId: new Types.ObjectId(articleId),
      userId: new Types.ObjectId(userId),
      comment: trimmed,
    });

    const savedComment = await newComment.save();

    // Update article's comment count
    await Article.findByIdAndUpdate(articleId, {
      $inc: { commentsCount: 1 }
    });

    // Serialize the comment for client
    const serializedComment: ISerializedComment = {
      _id: savedComment._id.toString(),
      articleId: savedComment.articleId.toString(),
      userId: savedComment.userId.toString(),
      comment: savedComment.comment,
      likes: [],
      reports: [],
      isDeleted: savedComment.isDeleted,
      deletedAt: savedComment.deletedAt?.toISOString(),
      deletedBy: savedComment.deletedBy?.toString(),
      createdAt: savedComment.createdAt.toISOString(),
      updatedAt: savedComment.updatedAt.toISOString(),
    };

    return {
      success: true,
      comment: serializedComment,
    };
  } catch (error) {
    console.error("Error in createComment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comment",
    };
  }
};
