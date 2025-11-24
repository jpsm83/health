"use server";

import { IGetArticlesParams, ISerializedArticle } from "@/types/article";
import { IPaginatedResponse } from "@/types/api";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getArticlesByCategoryPaginated(
  params: IGetArticlesParams & { category: string; skipCount?: boolean; fields?: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  try {
    const {
      page = 1,
      limit = 9,
      sort = "createdAt",
      order = "desc",
      locale = "en",
      category,
      slug,
      query,
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

    if (slug) {
      queryParams.set("slug", slug);
    }

    if (query) {
      queryParams.set("query", query);
    }

    if (excludeIds && excludeIds.length > 0) {
      queryParams.set("excludeIds", JSON.stringify(excludeIds));
    }

    const result = await internalFetch<IPaginatedResponse<ISerializedArticle>>(
      `/api/v1/articles/paginated?${queryParams.toString()}`
    );

    return result;
  } catch (error) {
    console.error("Error fetching articles by category paginated:", error);
    throw new Error(
      `Failed to fetch articles by category paginated: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
