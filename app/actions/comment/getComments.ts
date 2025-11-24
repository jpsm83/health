"use server";

import { IGetCommentsParams, ISerializedComment } from "@/types/comment";
import { internalFetch } from "@/app/actions/utils/internalFetch";

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

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      order,
    });

    if (articleId) {
      queryParams.set("articleId", articleId);
    }

    if (userId) {
      queryParams.set("userId", userId);
    }

    const result = await internalFetch<{
      success: boolean;
      data: {
        comments: ISerializedComment[];
        totalCount: number;
        hasMore: boolean;
        page: number;
        limit: number;
      };
    }>(`/api/v1/comments?${queryParams.toString()}`);

    return {
      success: true,
      comments: result.data.comments,
      totalCount: result.data.totalCount,
      hasMore: result.data.hasMore,
    };
  } catch (error) {
    console.error("Error in getComments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get comments",
    };
  }
};
