import { NextResponse } from "next/server";

// imported utils
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported interfaces
import { IGetArticlesParams } from "@/interfaces/article";

// imported server actions
import { getArticlesByCategoryPaginated } from "@/app/actions/article/getArticlesByCategoryPaginated";
import { searchArticlesPaginated } from "@/app/actions/article/searchArticlesPaginated";

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

    // ------------------------
    // Validate excludeIds format
    // ------------------------
    let excludeIdsArray: string[] | undefined;
    if (excludeIds) {
      try {
        excludeIdsArray = JSON.parse(excludeIds);
        if (!Array.isArray(excludeIdsArray) || excludeIdsArray.length === 0) {
          return new NextResponse(
            JSON.stringify({
              message:
                "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
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
    // Use appropriate server action based on parameters
    // ------------------------
    const params: IGetArticlesParams = {
      page,
      limit,
      sort,
      order,
      locale,
      category,
      slug,
      query,
      excludeIds: excludeIdsArray,
    };

    let result;

    // Decision logic:
    // - If query is provided → use searchArticlesPaginated (optimized for search)
    // - If category is provided (no query) → use getArticlesByCategoryPaginated (optimized for category filtering)
    // - If neither query nor category → return error (at least one is required)
    if (query && query.trim()) {
      // Use searchArticlesPaginated when query is specified
      // This action is optimized for search functionality
      result = await searchArticlesPaginated({
        ...params,
        query: query.trim(), // Ensure query is explicitly passed as string
      });
    } else if (category) {
      // Use getArticlesByCategoryPaginated when category is specified (no query)
      // This action is optimized for category filtering
      result = await getArticlesByCategoryPaginated({
        ...params,
        category, // Ensure category is explicitly passed as string
      });
    } else {
      // Neither query nor category provided
      return new NextResponse(
        JSON.stringify({
          message: "Either 'query' or 'category' parameter is required for paginated articles endpoint.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Handle no results
    // ------------------------
    if (result.data.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No articles found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError("Get paginated articles failed!", error as string);
  }
};
