"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import Article from "@/app/api/models/article";
import "@/app/api/models/user"; // Import User model for population
import { ICreateCommentParams, ISerializedComment } from "@/types/comment";
import { Types } from "mongoose";
import User from "@/app/api/models/user";


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

    // Note: Users are now allowed to comment on their own articles

    // Check if user has already commented on this article
    const existingComment = await Comment.findOne({
      articleId: new Types.ObjectId(articleId),
      userId: new Types.ObjectId(userId),
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

    // Update user's commentedArticles array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { commentedArticles: articleId }
    });

    // Populate user data for the comment
    const populatedComment = await Comment.findById(savedComment._id)
      .populate({
        path: "userId",
        select: "username imageUrl",
        model: "User",
      })
      .lean();

    if (!populatedComment) {
      throw new Error("Failed to retrieve created comment");
    }

    // Serialize the comment for client with populated user data
    const commentData = populatedComment as Record<string, unknown>;
    const userData = commentData.userId as Record<string, unknown>;
    const serializedComment: ISerializedComment = {
      _id: (commentData._id as { toString: () => string }).toString(),
      articleId: (commentData.articleId as { toString: () => string }).toString(),
      userId: {
        _id: (userData._id as { toString: () => string }).toString(),
        username: userData.username as string,
        imageUrl: (userData.imageUrl as string) || undefined,
      },
      comment: commentData.comment as string,
      likes: [],
      reports: [],
      createdAt: (commentData.createdAt as Date).toISOString(),
      updatedAt: (commentData.updatedAt as Date).toISOString(),
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
