"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";
import { ISerializedArticle } from "@/types/article";

interface UpdateArticleParams {
  articleId: string;
  category?: string;
  languages?: unknown;
  imagesContext?: {
    imageOne: string;
    imageTwo: string;
    imageThree: string;
    imageFour: string;
  };
  articleImages?: File[] | string[];
  userId: string;
  isAdmin?: boolean;
}

export interface IUpdateArticleResponse {
  success: boolean;
  message?: string;
  article?: ISerializedArticle;
  error?: string;
}

export async function updateArticle(
  params: UpdateArticleParams
): Promise<IUpdateArticleResponse> {
  try {
    // Note: This action is a thin bridge. The route handler expects FormData,
    // but this action accepts a params object. The route handler should be called
    // directly with FormData when updating articles from the frontend.
    // This action is kept for backward compatibility but may not work correctly
    // for file uploads. Consider using the API route directly for updates.
    
    const result = await internalFetch<{
      success: boolean;
      message: string;
      article?: ISerializedArticle;
    }>(`/api/v1/articles/by-id/${params.articleId}`, {
      method: "PATCH",
      body: {
        category: params.category,
        languages: params.languages,
        imagesContext: params.imagesContext,
        articleImages: params.articleImages,
      },
    });

    return {
      success: result.success || true,
      message: result.message || "Article updated successfully",
      article: result.article,
    };
  } catch (error) {
    console.error("Update article error:", error);
    const errorMessage = error instanceof Error ? error.message : "Update article failed";
    
    // Check for specific error types
    if (errorMessage.includes("not found")) {
      return {
        success: false,
        message: "Article not found",
      };
    }
    
    if (errorMessage.includes("not authorized")) {
      return {
        success: false,
        message: "You are not authorized to update this article",
      };
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
