"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import { IGetCommentsParams, ISerializedComment } from "@/interfaces/comment";
import { Types } from "mongoose";

export const getComments = async (params: IGetCommentsParams): Promise<{
  success: boolean;
  comments?: ISerializedComment[];
  totalCount?: number;
  hasMore?: boolean;
  error?: string;
}> => {
  try {
  const {
    articleId,
    userId,
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
  } = params;

    await connectDb();

    // Build query
    const query: Record<string, unknown> = {};
    
    if (articleId) {
      query.articleId = new Types.ObjectId(articleId);
    }
    
    if (userId) {
      query.userId = new Types.ObjectId(userId);
    }

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get comments with pagination
    const [comments, totalCount] = await Promise.all([
      Comment.find(query)
        .populate({
          path: "userId",
          select: "username imageUrl",
          model: "User"
        })
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments(query),
    ]);

    // Serialize comments
    const serializedComments: ISerializedComment[] = comments.map((comment: Record<string, unknown>) => {
      // Handle populated userId - it could be an object with user data or just an ObjectId string
      let userId: string | { _id: string; username: string; imageUrl?: string };
      
      if (comment.userId && typeof comment.userId === 'object' && comment.userId !== null && 'username' in comment.userId) {
        // User is populated
        const user = comment.userId as { _id: { toString: () => string }; username: string; imageUrl?: string };
        userId = {
          _id: user._id.toString(),
          username: user.username,
          imageUrl: user.imageUrl,
        };
      } else {
        // User is not populated, just ObjectId
        userId = comment.userId?.toString() || '';
      }

      return {
        _id: (comment._id as { toString: () => string }).toString(),
        articleId: (comment.articleId as { toString: () => string }).toString(),
        userId: userId,
        comment: comment.comment as string,
        likes: (comment.likes as unknown[])?.map((like: unknown) => (like as { toString: () => string }).toString()) || [],
        reports: (comment.reports as unknown[])?.map((report: unknown) => {
          const reportObj = report as Record<string, unknown>;
          return {
            userId: (reportObj.userId as { toString: () => string }).toString(),
            reason: reportObj.reason as 'bad_language' | 'racist' | 'spam' | 'harassment' | 'inappropriate_content' | 'false_information' | 'other',
            reportedAt: (reportObj.reportedAt as Date)?.toISOString() || new Date().toISOString(),
          };
        }) || [],
        createdAt: (comment.createdAt as Date).toISOString(),
        updatedAt: (comment.updatedAt as Date).toISOString(),
      };
    });

    const hasMore = skip + comments.length < totalCount;

    return {
      success: true,
      comments: serializedComments,
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error("Error in getComments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get comments",
    };
  }
};
