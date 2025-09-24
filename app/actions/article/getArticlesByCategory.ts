"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, ILanguageSpecific, serializeMongoObject } from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export async function getArticlesByCategory(
  params: IGetArticlesParams & { category: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  const {
    page = 1,
    limit = 6,
    sort = "createdAt",
    order = "desc",
    locale = "en",
    category,
    excludeIds,
  } = params;

  try {
    await connectDb();

    // ------------------------
    // Build filter (matching getArticles.ts logic)
    // ------------------------
    const mongoFilter: IMongoFilter = {
      category, // Always filter by category
    };

    // Exclude already loaded IDs
    if (excludeIds && excludeIds.length > 0) {
      mongoFilter._id = { $nin: excludeIds };
    }

    // ------------------------
    // Query DB (matching getArticles.ts logic)
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
    // Post-process by locale (matching getArticles.ts logic)
    // ------------------------
    const articlesWithFilteredContent = articles
      .map((article: IArticleLean) => {
        let languageSpecific: ILanguageSpecific | undefined;

        // Try requested locale
        languageSpecific = article.languages.find(
          (lang: ILanguageSpecific) => lang.hreflang === locale
        );

        // Fallback to English if locale not found
        if (!languageSpecific && locale !== "en") {
          languageSpecific = article.languages.find(
            (lang: ILanguageSpecific) => lang.hreflang === "en"
          );
        }

        // Final fallback: first available
        if (!languageSpecific && article.languages.length > 0) {
          languageSpecific = article.languages[0];
        }

        return {
          ...article,
          languages: languageSpecific ? [languageSpecific] : [],
        };
      })
      .filter((article: IArticleLean) => article.languages.length > 0);

    // ------------------------
    // Pagination metadata (matching getArticles.ts logic)
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
    console.error("Error fetching articles by category:", error);
    
    // Check if it's a connection error (common on mobile)
    if (error instanceof Error && (
      error.message.includes('connection') || 
      error.message.includes('timeout') ||
      error.message.includes('network')
    )) {
      // For connection errors, throw to trigger retry mechanism
      throw new Error(`Network error: ${error.message}`);
    }
    
    // For other errors, return empty response but log the specific error
    console.error("Specific error details:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      params: { page, limit, sort, order, locale, category }
    });
    
    return {
      page,
      limit,
      totalDocs: 0,
      totalPages: 0,
      data: [],
    };
  }
}
