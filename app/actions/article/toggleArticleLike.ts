"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";

export const toggleArticleLike = async (articleId: string, userId: string) => {
  try {
    if (!userId) {
      throw new Error("You must be signed in to like articles");
    }

    const result = await internalFetch<{
      success: boolean;
      liked: boolean;
      likeCount: number;
      message: string;
      error?: string;
    }>(`/api/v1/articles/by-id/${articleId}/likes`, {
      method: "POST",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to toggle like",
      };
    }

    return {
      success: true,
      liked: result.liked,
      likeCount: result.likeCount,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
};
