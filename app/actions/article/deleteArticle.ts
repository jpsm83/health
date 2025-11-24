"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface IDeleteArticleResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteArticle(
  articleId: string,
  userId: string,
  isAdmin: boolean = false
): Promise<IDeleteArticleResponse> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
    }>(`/api/v1/articles/by-id/${articleId}`, {
      method: "DELETE",
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Failed to delete article",
      };
    }

    return {
      success: true,
      message: result.message || "Article deleted successfully!",
    };
  } catch (error) {
    console.error("Delete article failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Delete article failed!";
    
    // Check for specific error types
    if (errorMessage.includes("Invalid article ID format")) {
      return {
        success: false,
        message: "Invalid article ID format!",
      };
    }
    
    if (errorMessage.includes("not found")) {
      return {
        success: false,
        message: "Article not found!",
      };
    }
    
    if (errorMessage.includes("not authorized")) {
      return {
        success: false,
        message: "You are not authorized to delete this article! Only administrators can delete articles.",
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
