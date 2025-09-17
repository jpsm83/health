"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, IContentsByLanguage, serializeMongoObject } from "@/types/article";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";

export async function searchArticlesPaginated(
  params: IGetArticlesParams & { query: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
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
  } = params;

  try {
    await connectDb();

    // ------------------------
    // Build filter (matching paginated route logic)
    // ------------------------
    if (category && slug) {
      throw new Error("Category and slug are not allowed together!");
    }

    const mongoFilter: IMongoFilter = {};

    if (slug) {
      mongoFilter["contentsByLanguage.seo.slug"] = slug;
    }

    if (category) {
      mongoFilter.category = category;
    }

    // Search query using contentsByLanguage structure (matching paginated route)
    if (query && query.trim()) {
      mongoFilter["contentsByLanguage"] = { 
        $elemMatch: { 
          mainTitle: { $regex: query.trim(), $options: "i" } 
        } 
      };
    }

    // Exclude already loaded IDs
    if (excludeIds && excludeIds.length > 0) {
      mongoFilter._id = { $nin: excludeIds };
    }

    // ------------------------
    // Query DB (always use fetch all then paginate for search)
    // ------------------------
    // For search, we always need to fetch all results first because of locale filtering
    // This ensures consistent pagination after post-processing
    const allFilteredArticles = await Article.find(mongoFilter)
      .populate({ path: "createdBy", select: "username" })
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .lean() as IArticleLean[];
    
    // Apply pagination to the filtered results (after locale filtering)
    // First apply locale filtering to all articles
    const allArticlesWithLocaleFilter = allFilteredArticles
      .map((article: IArticleLean) => {
        let contentByLanguage: IContentsByLanguage | undefined;

        if (slug) {
          // Exact slug match
          contentByLanguage = article.contentsByLanguage.find(
            (content: IContentsByLanguage) => content.seo.slug === slug
          );
        } else {
          // Try requested locale
          contentByLanguage = article.contentsByLanguage.find(
            (content: IContentsByLanguage) => content.seo.hreflang === locale
          );

          // Fallback to English if locale not found
          if (!contentByLanguage && locale !== "en") {
            contentByLanguage = article.contentsByLanguage.find(
              (content: IContentsByLanguage) => content.seo.hreflang === "en"
            );
          }

          // Final fallback: first available
          if (!contentByLanguage && article.contentsByLanguage.length > 0) {
            contentByLanguage = article.contentsByLanguage[0];
          }
        }

        return {
          ...article,
          contentsByLanguage: contentByLanguage ? [contentByLanguage] : [],
        };
      })
      .filter((article: IArticleLean) => article.contentsByLanguage.length > 0);

    // Apply pagination to the locale-filtered results
    const skip = (page - 1) * limit;
    const articles = allArticlesWithLocaleFilter.slice(skip, skip + limit);

    // ------------------------
    // Handle no results
    // ------------------------
    if (!articles) {
      return {
        page,
        limit,
        totalDocs: 0,
        totalPages: 0,
        data: [],
      };
    }

    // ------------------------
    // Articles are already filtered by locale above
    // ------------------------
    const articlesWithFilteredContent = articles;

    // ------------------------
    // Pagination metadata (count after locale filtering for search)
    // ------------------------
    // For search, we need to count after locale filtering to ensure accurate pagination
    // We already have allArticlesWithLocaleFilter from above
    const totalDocs = allArticlesWithLocaleFilter.length;
    const totalPages = Math.ceil(totalDocs / limit);

    // Serialize MongoDB objects to plain objects for client components
    const serializedArticles = articlesWithFilteredContent.map((article: IArticleLean): ISerializedArticle => {
      return serializeMongoObject(article) as ISerializedArticle;
    });

    return {
      page,
      limit,
      totalDocs,
      totalPages,
      data: serializedArticles,
    };
  } catch (error) {
    console.error("Error searching articles paginated:", error);
    // Return empty paginated response instead of throwing error
    return {
      page,
      limit,
      totalDocs: 0,
      totalPages: 0,
      data: [],
    };
  }
}
