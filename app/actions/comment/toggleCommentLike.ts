"use server";

import { IToggleCommentLikeParams } from "@/types/comment";
import { internalFetch } from "@/app/actions/utils/internalFetch";

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

    const result = await internalFetch<{
      success: boolean;
      data: {
        liked: boolean;
        likeCount: number;
        message: string;
      };
      message?: string;
    }>(`/api/v1/comments/${commentId}/likes`, {
      method: "POST",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.message || "Failed to toggle comment like",
      };
    }

    return {
      success: true,
      liked: result.data.liked,
      likeCount: result.data.likeCount,
      message: result.data.message,
    };
  } catch (error) {
    console.error("Error in toggleCommentLike:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle comment like",
    };
  }
};
