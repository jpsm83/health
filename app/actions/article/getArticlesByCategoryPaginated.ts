"use server";

import { IGetArticlesParams, IArticleLean, ISerializedArticle, IContentsByLanguage, serializeMongoObject } from "@/types/article";
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
      mongoFilter["contentsByLanguage.seo.slug"] = slug;
    }

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
