"use server";

import { IGetArticlesParams, ISerializedArticle } from "@/types/article";
import { IPaginatedResponse } from "@/types/api";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getArticlesByCategory(
  params: IGetArticlesParams & { category: string; skipCount?: boolean; fields?: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  try {
    const {
      page = 1,
      limit = 6,
      sort = "createdAt",
      order = "desc",
      locale = "en",
      category,
      excludeIds,
      skipCount = false,
      fields = "full",
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      order,
      locale,
      category,
      fields,
      skipCount: String(skipCount),
    });

    if (excludeIds && excludeIds.length > 0) {
      queryParams.set("excludeIds", JSON.stringify(excludeIds));
    }

    const result = await internalFetch<IPaginatedResponse<ISerializedArticle>>(
      `/api/v1/articles?${queryParams.toString()}`
    );

    return result;
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw new Error(
      `Failed to fetch articles by category: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
