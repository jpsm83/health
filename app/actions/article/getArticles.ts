"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, IContentsByLanguage, serializeMongoObject } from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export async function getArticles(params: IGetArticlesParams = {}): Promise<IPaginatedResponse<ISerializedArticle>> {
  const {
    page = 1,
    limit = 9,
    sort = "createdAt",
    order = "desc",
    locale = "en",
    excludeIds,
    category,
    slug,
  } = params;

  try {
    await connectDb();

    // ------------------------
    // Build filter (matching route.ts logic)
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

    // Exclude already loaded IDs
    if (excludeIds && excludeIds.length > 0) {
      mongoFilter._id = { $nin: excludeIds };
    }

    // ------------------------
    // Query DB (matching route.ts logic)
    // ------------------------
    const articles = await Article.find(mongoFilter)
      .populate({ path: "createdBy", select: "username" })
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean() as IArticleLean[];

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
    // Post-process by locale (matching route.ts logic)
    // ------------------------
    const articlesWithFilteredContent = articles
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

    // ------------------------
    // Pagination metadata (matching route.ts logic)
    // ------------------------
    const totalDocs = await Article.countDocuments(mongoFilter);
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
    console.error("Error fetching articles:", error);
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
