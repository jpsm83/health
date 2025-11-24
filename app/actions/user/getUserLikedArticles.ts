"use server";

import { ISerializedArticle } from "@/types/article";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface IGetUserLikedArticlesResponse {
  success: boolean;
  data?: ISerializedArticle[];
  totalDocs?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
  error?: string;
}

export async function getUserLikedArticles(
  userId: string,
  page: number = 1,
  limit: number = 6,
  locale: string = "en"
): Promise<IGetUserLikedArticlesResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      locale,
    });

    const result = await internalFetch<{
      success: boolean;
      data: ISerializedArticle[];
      totalDocs: number;
      totalPages: number;
      currentPage: number;
      message?: string;
    }>(`/api/v1/users/${userId}/liked-articles?${queryParams.toString()}`);

    return {
      success: true,
      data: result.data || [],
      totalDocs: result.totalDocs || 0,
      totalPages: result.totalPages || 0,
      currentPage: result.currentPage || page,
      message: result.message,
    };
  } catch (error) {
    console.error("Get user liked articles failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Get user liked articles failed!",
    };
  }
}
