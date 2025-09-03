import { NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";
import { mainCategories } from "@/lib/constants";
import { IContentsByLanguage } from "@/interfaces/article";

// @desc    Get articles by category
// @route   GET /articles/category/[category]
// @access  Public
export const GET = async (
  req: Request,
  context: { params: Promise<{ category: string }> }
) => {
  try {
    const { category } = await context.params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Validate category
    if (!mainCategories.includes(category)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid category!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to database
    await connectDb();

    // Find articles by category
    const articlesByCategory = await Article.find({
      category: category,
    })
      .populate({
        path: "createdBy",
        select: "username",
        model: User,
      })
      .lean();

    if (!articlesByCategory || articlesByCategory.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: `No articles found in ${category} category` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter articles that have content for the current locale
    // If no content found for the requested locale, fallback to English
    const articlesWithLocaleContent = articlesByCategory
      .map((article) => {
        // First try to find content for the requested locale
        let contentByLanguage = article.contentsByLanguage.find(
          (content: IContentsByLanguage) => content.seo.hreflang === locale
        );

        // If not found and locale is not English, fallback to English
        if (!contentByLanguage && locale !== "en") {
          contentByLanguage = article.contentsByLanguage.find(
            (content: IContentsByLanguage) => content.seo.hreflang === "en"
          );
        }

        if (contentByLanguage) {
          return {
            ...article,
            contentsByLanguage: [contentByLanguage], // Only pass the matching locale content
          };
        }
        return null;
      })
      .filter(Boolean);

    if (articlesWithLocaleContent.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: `No articles found in ${category} category for locale ${locale}` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify(articlesWithLocaleContent),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Get articles by category failed!", error as string);
  }
};
