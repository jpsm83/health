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
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    // ------------------------
    // Validate slug parameter
    // ------------------------
    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          message: "Valid slug parameter is required!",
        },
        { status: 400 }
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
      return NextResponse.json({ message: "Article not found!" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("Error in route.ts:", error);
    return handleApiError("Get article by slug failed!", error as string);
  }
};
