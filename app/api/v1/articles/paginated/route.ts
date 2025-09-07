import { NextResponse } from "next/server";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported models
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// imported interfaces
import { IContentsByLanguage } from "@/interfaces/article";

interface IMongoFilter {
  [key: string]: unknown;
}

// @desc    Get paginated articles with advanced features
// @route   GET /articles/paginated
// @access  Public
export const GET = async (req: Request) => {
  try {
    await connectDb();

    // ------------------------
    // Parse query parameters
    // ------------------------
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? 1 : -1;

    const slug = searchParams.get("slug") || undefined;
    const category = searchParams.get("category") || undefined;
    const locale = searchParams.get("locale") || "en";
    const excludeIds = searchParams.get("excludeIds") || undefined;
    const query = searchParams.get("query") || undefined;

    // ------------------------
    // Build filter
    // ------------------------
    if (category && slug) {
      return new NextResponse(
        JSON.stringify({
          message: "Category and slug are not allowed together!",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const mongoFilter: IMongoFilter = {};

    if (slug) {
      mongoFilter["contentsByLanguage.seo.slug"] = slug;
    }

    if (category) {
      mongoFilter.category = category;
    }

    if (query && query.trim()) {
      mongoFilter["contentsByLanguage"] = { 
        $elemMatch: { 
          mainTitle: { $regex: query.trim(), $options: "i" } 
        } 
      };
      console.log("Search query:", query.trim());
      console.log("MongoDB filter:", JSON.stringify(mongoFilter, null, 2));
    }

    // Exclude already loaded IDs
    if (excludeIds) {
      try {
        const excludeIdsArray = JSON.parse(excludeIds);
        if (Array.isArray(excludeIdsArray) && excludeIdsArray.length > 0) {
          mongoFilter._id = { $nin: excludeIdsArray };
        }
      } catch {
        return new NextResponse(
          JSON.stringify({
            message:
              "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // ------------------------
    // Query DB
    // ------------------------
    let articles;
    
    if (excludeIds) {
      // When using excludeIds, we need to get all filtered results first
      // then apply pagination to the filtered results
      const allFilteredArticles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username", model: User })
        .sort({ [sort]: order })
        .lean();
      
      // Apply pagination to the filtered results
      const skip = (page - 1) * limit;
      articles = allFilteredArticles.slice(skip, skip + limit);
    } else {
      // Normal pagination without exclusions
      const skip = (page - 1) * limit;
      articles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username", model: User })
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit)
        .lean();
    }

    // ------------------------
    // Handle no results
    // ------------------------
    if (!articles || articles.length === 0) {
      const response = {
        page,
        limit,
        totalDocs: 0,
        totalPages: 0,
        data: [],
      };
      
      return new NextResponse(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ------------------------
    // Post-process by locale
    // ------------------------
    const articlesWithFilteredContent = articles
      .map((article) => {
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
      .filter((article) => article.contentsByLanguage.length > 0);

    // ------------------------
    // Pagination metadata
    // ------------------------
    let totalDocs, totalPages;
    
    if (excludeIds) {
      // When using excludeIds, count the filtered results
      const allFilteredArticles = await Article.find(mongoFilter)
        .populate({ path: "createdBy", select: "username", model: User })
        .sort({ [sort]: order })
        .lean();
      
      totalDocs = allFilteredArticles.length;
      totalPages = Math.ceil(totalDocs / limit);
    } else {
      // Normal count without exclusions
      totalDocs = await Article.countDocuments(mongoFilter);
      totalPages = Math.ceil(totalDocs / limit);
    }

    const response = {
      page,
      limit,
      totalDocs,
      totalPages,
      data: articlesWithFilteredContent,
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError("Get paginated articles failed!", error as string);
  }
};
