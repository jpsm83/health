"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, ILanguageSpecific, serializeMongoObject } from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user"; // Import User model to ensure it's registered
// Ensure User model is registered for populate operations
void User;

export async function getArticlesByCategory(
  params: IGetArticlesParams & { category: string; skipCount?: boolean }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  
  const {
    page = 1,
    limit = 6,
    sort = "createdAt",
    order = "desc",
    locale = "en",
    category,
    excludeIds,
    skipCount = false,
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

        // If we still don't have a language match, but the article has languages,
        // use the first available language to prevent data loss
        if (!languageSpecific && article.languages && article.languages.length > 0) {
          languageSpecific = article.languages[0];
        }

        return {
          ...article,
          languages: languageSpecific ? [languageSpecific] : [],
        };
      })
      .filter((article: IArticleLean) => {
        // Only filter out articles that have NO language content at all
        // This ensures we don't lose articles due to language filtering issues
        return article.languages && article.languages.length > 0;
      });

    // ------------------------
    // Pagination metadata (matching getArticles.ts logic)
    // ------------------------
    // Skip expensive countDocuments query if skipCount is true (for home page performance)
    const totalDocs = skipCount ? 0 : await Article.countDocuments(mongoFilter);
    const totalPages = skipCount ? 0 : Math.ceil(totalDocs / limit);

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
    
    // Log detailed error information for debugging
    console.error("Specific error details:", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params: { page, limit, sort, order, locale, category },
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
    
    // Check if it's a connection error (common on mobile)
    if (error instanceof Error && (
      error.message.includes('connection') || 
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('MongoServerError') ||
      error.message.includes('MongoNetworkError')
    )) {
      // For connection errors, throw to trigger retry mechanism
      throw new Error(`Database connection error: ${error.message}`);
    }
    
    // For other errors, also throw instead of returning empty data
    // This will help identify the real issue in production
    throw new Error(`Failed to fetch articles by category: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
