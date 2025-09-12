import { NextResponse } from "next/server";

// imported utils
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported server actions
import { getArticleBySlug } from "@/app/actions/article/getArticleBySlug";

// @desc    Get article by slug
// @route   GET /articles/[slug]
// @access  Public
export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    // ------------------------
    // Validate slug parameter
    // ------------------------
    if (!slug || typeof slug !== "string") {
      return new NextResponse(
        JSON.stringify({
          message: "Valid slug parameter is required!",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ------------------------
    // Use server action to get article by slug
    // ------------------------
    const article = await getArticleBySlug(slug, locale);

    // ------------------------
    // Handle no results
    // ------------------------
    if (!article) {
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(JSON.stringify(article), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in route.ts:", error);
    return handleApiError("Get article by slug failed!", error as string);
  }
};
