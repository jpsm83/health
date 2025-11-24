import { NextResponse } from "next/server";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { fieldProjections, FieldProjectionType } from "@/app/api/utils/fieldProjections";

// imported models
import Article from "@/app/api/models/article";

// imported interfaces
import {
  IArticleLean,
  ISerializedArticle,
  ILanguageSpecific,
  serializeMongoObject,
} from "@/types/article";
import { IMongoFilter, IPaginatedResponse } from "@/types/api";

// @desc    Get paginated articles with advanced features
// @route   GET /articles/paginated
// @access  Public
export const GET = async (req: Request) => {
  try {
    // ------------------------
    // Parse query parameters
    // ------------------------
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const slug = searchParams.get("slug") || undefined;
    const category = searchParams.get("category") || undefined;
    const locale = searchParams.get("locale") || "en";
    const excludeIds = searchParams.get("excludeIds") || undefined;
    const query = searchParams.get("query") || undefined;
    const fields = (searchParams.get("fields") || "full") as FieldProjectionType;
    const skipCount = searchParams.get("skipCount") === "true";

    // ------------------------
    // Validate excludeIds format
    // ------------------------
    let excludeIdsArray: string[] | undefined;
    if (excludeIds) {
      try {
        excludeIdsArray = JSON.parse(excludeIds);
        if (!Array.isArray(excludeIdsArray) || excludeIdsArray.length === 0) {
          return NextResponse.json(
            {
              message:
                "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            message:
              "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
          },
          { status: 400 }
        );
      }
    }

    // ------------------------
    // Validate fields parameter
    // ------------------------
    if (!["featured", "dashboard", "full"].includes(fields)) {
      return NextResponse.json(
        {
          message: "Invalid fields parameter. Must be 'featured', 'dashboard', or 'full'.",
        },
        { status: 400 }
      );
    }

    // ------------------------
    // Validate required parameters
    // ------------------------
    if (!query && !category) {
      return NextResponse.json(
        {
          message: "Either 'query' or 'category' parameter is required for paginated articles endpoint.",
        },
        { status: 400 }
      );
    }

    // ------------------------
    // Build filter
    // ------------------------
    if (category && slug) {
      return NextResponse.json(
        {
          message: "Category and slug are not allowed together!",
        },
        { status: 400 }
      );
    }

    await connectDb();

    const mongoFilter: IMongoFilter = {};

    if (category) {
      mongoFilter.category = category;
    }

    if (slug) {
      mongoFilter["languages.seo.slug"] = slug;
    }

    // Search query using languages structure
    if (query && query.trim()) {
      mongoFilter["languages"] = {
        $elemMatch: {
          "content.mainTitle": { $regex: query.trim(), $options: "i" },
        },
      };
    }

    // Exclude already loaded IDs
    if (excludeIdsArray && excludeIdsArray.length > 0) {
      mongoFilter._id = { $nin: excludeIdsArray };
    }

    // ------------------------
    // Get field projection
    // ------------------------
    const projection = fieldProjections[fields] || {};

    // ------------------------
    // Query DB
    // ------------------------
    // For search queries, we need to fetch all and filter by locale first
    // For category queries, we can use database-level pagination
    const isSearchQuery = query && query.trim();

    let articles: IArticleLean[];
    let totalDocs: number;
    let totalPages: number;

    if (isSearchQuery) {
      // For search: fetch all, filter by locale, then paginate in memory
      const allFilteredArticles = await Article.find(mongoFilter, projection)
        .populate({ path: "createdBy", select: "username" })
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .lean() as IArticleLean[];

      // Apply locale filtering to all articles
      const allArticlesWithLocaleFilter = allFilteredArticles
        .map((article: IArticleLean) => {
          let languageSpecific: ILanguageSpecific | undefined;

          if (slug) {
            languageSpecific = article.languages.find(
              (lang: ILanguageSpecific) => lang.seo.slug === slug
            );
          } else {
            languageSpecific = article.languages.find(
              (lang: ILanguageSpecific) => lang.hreflang === locale
            );

            if (!languageSpecific && locale !== "en") {
              languageSpecific = article.languages.find(
                (lang: ILanguageSpecific) => lang.hreflang === "en"
              );
            }

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

      // Apply pagination to the locale-filtered results
      const skip = (page - 1) * limit;
      articles = allArticlesWithLocaleFilter.slice(skip, skip + limit);

      // Count after locale filtering for search
      totalDocs = skipCount ? 0 : allArticlesWithLocaleFilter.length;
      totalPages = skipCount ? 0 : Math.ceil(totalDocs / limit);
    } else {
      // For category: use database-level pagination
      const skip = (page - 1) * limit;
      articles = (await Article.find(mongoFilter, projection)
        .populate({ path: "createdBy", select: "username" })
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit)
        .lean()) as IArticleLean[];

      // Apply locale filtering
      const articlesWithFilteredContent = articles
        .map((article: IArticleLean) => {
          let languageSpecific: ILanguageSpecific | undefined;

          if (slug) {
            languageSpecific = article.languages.find(
              (lang: ILanguageSpecific) => lang.seo.slug === slug
            );
          } else {
            languageSpecific = article.languages.find(
              (lang: ILanguageSpecific) => lang.hreflang === locale
            );

            if (!languageSpecific && locale !== "en") {
              languageSpecific = article.languages.find(
                (lang: ILanguageSpecific) => lang.hreflang === "en"
              );
            }

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

      articles = articlesWithFilteredContent;

      // Count documents (before locale filtering for category queries)
      totalDocs = skipCount ? 0 : await Article.countDocuments(mongoFilter);
      totalPages = skipCount ? 0 : Math.ceil(totalDocs / limit);
    }

    // ------------------------
    // Handle no results
    // ------------------------
    if (!articles || articles.length === 0) {
      return NextResponse.json(
        {
          page,
          limit,
          totalDocs: 0,
          totalPages: 0,
          data: [],
        },
        { status: 200 }
      );
    }

    // ------------------------
    // Serialize MongoDB objects
    // ------------------------
    const serializedArticles = articles.map(
      (article: IArticleLean): ISerializedArticle => {
        return serializeMongoObject(article) as ISerializedArticle;
      }
    );

    const result: IPaginatedResponse<ISerializedArticle> = {
      page,
      limit,
      totalDocs,
      totalPages,
      data: serializedArticles,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching paginated articles:", error);
    return handleApiError("Get paginated articles failed!", error as string);
  }
};
