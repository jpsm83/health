"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, ILanguageSpecific, serializeMongoObject } from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

// Disable caching for this server action to prevent production caching issues
export const revalidate = 0;

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
      mongoFilter["languages.seo.slug"] = slug;
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
        let languageSpecific: ILanguageSpecific | undefined;

        if (slug) {
          // Exact slug match
          languageSpecific = article.languages.find(
            (lang: ILanguageSpecific) => lang.seo.slug === slug
          );
        } else {
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
      params: { page, limit, sort, order, locale, category, slug }
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
