"use server";

import { ISerializedArticle } from "@/types/article";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getArticleBySlug(
  slug: string,
  locale = "en",
  fields = "full"
): Promise<ISerializedArticle | null> {
  try {
    if (!slug || typeof slug !== "string") {
      throw new Error("Valid slug parameter is required!");
    }

    const queryParams = new URLSearchParams({
      locale,
      fields,
    });

    const result = await internalFetch<ISerializedArticle>(
      `/api/v1/articles/by-slug/${slug}?${queryParams.toString()}`
    );

    return result;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    // Return null instead of throwing error (matching service behavior)
    return null;
  }
}
