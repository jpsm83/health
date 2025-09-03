import { NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";
import { mainCategories } from "@/lib/constants";
import { IArticle, IContentsByLanguage } from "@/interfaces/article";

// @desc    Get article by category and slug
// @route   GET /articles/category/[category]/[slug]
// @access  Public
export const GET = async (
  req: Request,
  context: { params: Promise<{ category: string; slug: string }> }
) => {
  try {
    const { category, slug } = await context.params;
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

    // Find article by category and slug
    const article = await Article.findOne({
      category: category,
      "contentsByLanguage.seo.slug": slug,
    })
      .populate({
        path: "createdBy",
        select: "username",
        model: User,
      })
      .lean() as IArticle | null;

    if (!article) {
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the content for the current locale with fallback to English
    let contentByLanguage = article.contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.slug === slug
    );
    
    // If not found, try to find by locale (for cases where slug might be different)
    if (!contentByLanguage) {
      contentByLanguage = article.contentsByLanguage.find(
        (content: IContentsByLanguage) => content.seo.hreflang === locale
      );
    }
    
    // If still not found and locale is not English, fallback to English
    if (!contentByLanguage && locale !== 'en') {
      contentByLanguage = article.contentsByLanguage.find(
        (content: IContentsByLanguage) => content.seo.hreflang === 'en'
      );
    }

    if (!contentByLanguage) {
      return new NextResponse(
        JSON.stringify({ message: "Content not found for this language!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a modified article object with only the matching locale content
    const modifiedArticle = {
      ...article,
      contentsByLanguage: [contentByLanguage], // Only pass the matching locale content
    };

    return new NextResponse(
      JSON.stringify(modifiedArticle),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Get article by category and slug failed!", error as string);
  }
};
