"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, ILanguageSpecific, serializeMongoObject } from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export async function getArticlesByCategoryPaginated(
  params: IGetArticlesParams & { category: string }
): Promise<IPaginatedResponse<ISerializedArticle>> {
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
  } = params;

  try {
    await connectDb();

    // ------------------------
    // Build filter (matching paginated route logic)
    // ------------------------
    if (category && slug) {
      throw new Error("Category and slug are not allowed together!");
    }

    const mongoFilter: IMongoFilter = {
      category, // Always filter by category
    };

    if (slug) {
      mongoFilter["languages.seo.slug"] = slug;
    }

    if (query && query.trim()) {
      mongoFilter["languages"] = { 
        $elemMatch: { 
          "content.mainTitle": { $regex: query.trim(), $options: "i" } 
        } 
      };
    }

    // Exclude already loaded IDs
    if (excludeIds && excludeIds.length > 0) {
      mongoFilter._id = { $nin: excludeIds };
    }

    // ------------------------
    // Query DB (matching paginated route logic)
    // ------------------------
    let articles: IArticleLean[];
    
    if (excludeIds && excludeIds.length > 0) {
      // When using excludeIds, we need to get all filtered results first
      // then apply pagination to the filtered results
      const allFilteredArticles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username" })
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .lean() as IArticleLean[];
      
      // Apply pagination to the filtered results
      const skip = (page - 1) * limit;
      articles = allFilteredArticles.slice(skip, skip + limit);
    } else {
      // Normal pagination without exclusions
      const skip = (page - 1) * limit;
      articles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username" })
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean() as IArticleLean[];
    }

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
    // Post-process by locale (matching paginated route logic)
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

        return {
          ...article,
          languages: languageSpecific ? [languageSpecific] : [],
        };
      })
      .filter((article: IArticleLean) => article.languages.length > 0);

    // ------------------------
    // Pagination metadata (matching paginated route logic)
    // ------------------------
    let totalDocs, totalPages;
    
    if (excludeIds && excludeIds.length > 0) {
      // When using excludeIds, count the filtered results
      const allFilteredArticles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username" })
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .lean() as IArticleLean[];
      
      totalDocs = allFilteredArticles.length;
      totalPages = Math.ceil(totalDocs / limit);
    } else {
      // Normal count without exclusions
      totalDocs = await Article.countDocuments(mongoFilter);
      totalPages = Math.ceil(totalDocs / limit);
    }

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
    console.error("Error fetching articles by category paginated:", error);
    
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
