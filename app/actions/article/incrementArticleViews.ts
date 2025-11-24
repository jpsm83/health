"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";

export const incrementArticleViews = async (articleId: string) => {
  try {
    if (!articleId) {
      throw new Error("Article ID is required");
    }

    const result = await internalFetch<{
      success: boolean;
      views: number;
      message: string;
      error?: string;
    }>(`/api/v1/articles/by-id/${articleId}/views`, {
      method: "POST",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to increment views",
      };
    }

    return {
      success: true,
      views: result.views,
      message: result.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to increment views",
    };
  }
};
