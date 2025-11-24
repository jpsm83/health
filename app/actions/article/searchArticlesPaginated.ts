"use server";

import { IGetArticlesParams, ISerializedArticle } from "@/types/article";
import { IPaginatedResponse } from "@/types/api";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function searchArticlesPaginated(
  params: IGetArticlesParams & { query: string; fields?: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  try {
    const {
      page = 1,
      limit = 9,
      sort = "createdAt",
      order = "desc",
      locale = "en",
      query,
      slug,
      category,
      excludeIds,
      fields = "full",
    } = params;

    // Build query string
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sort,
      order,
      locale,
      query: query.trim(),
      fields,
    });

    if (slug) {
      queryParams.set("slug", slug);
    }

    if (category) {
      queryParams.set("category", category);
    }

    if (excludeIds && excludeIds.length > 0) {
      queryParams.set("excludeIds", JSON.stringify(excludeIds));
    }

    const result = await internalFetch<IPaginatedResponse<ISerializedArticle>>(
      `/api/v1/articles/paginated?${queryParams.toString()}`
    );

    return result;
  } catch (error) {
    console.error("Error searching articles paginated:", error);
    throw new Error(
      `Failed to search articles: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
