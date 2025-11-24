import { NextResponse } from "next/server";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { fieldProjections, FieldProjectionType } from "@/app/api/utils/fieldProjections";

// imported models
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// imported interfaces
import {
  IArticleLean,
  ISerializedArticle,
  ILanguageSpecific,
  serializeMongoObject,
} from "@/types/article";

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
    const fields = (searchParams.get("fields") || "full") as FieldProjectionType;

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
    // Connect to database
    // ------------------------
    await connectDb();

    // ------------------------
    // Get field projection
    // ------------------------
    const projection = fieldProjections[fields] || {};

    // ------------------------
    // Query DB for article by slug
    // ------------------------
    const article = await Article.findOne({
      "languages.seo.slug": slug,
    }, projection)
      .populate({ path: "createdBy", select: "username", model: User })
      .lean() as IArticleLean | null;

    // ------------------------
    // Handle no results
    // ------------------------
    if (!article) {
      return NextResponse.json({ message: "Article not found!" }, { status: 404 });
    }

    // ------------------------
    // Post-process by locale
    // ------------------------
    const languages = article.languages as ILanguageSpecific[];
    let languageSpecific: ILanguageSpecific | undefined;

    // Try to find content for the requested slug first
    languageSpecific = languages.find(
      (lang: ILanguageSpecific) => lang.seo.slug === slug
    );

    // If not found by slug, try by locale
    if (!languageSpecific) {
      languageSpecific = languages.find(
        (lang: ILanguageSpecific) => lang.hreflang === locale
      );
    }

    // Fallback to English if locale not found
    if (!languageSpecific && locale !== "en") {
      languageSpecific = languages.find(
        (lang: ILanguageSpecific) => lang.hreflang === "en"
      );
    }

    // Final fallback: first available
    if (!languageSpecific && languages.length > 0) {
      languageSpecific = languages[0];
    }

    // If still no content found, return 404
    if (!languageSpecific) {
      return NextResponse.json({ message: "Article not found!" }, { status: 404 });
    }

    // ------------------------
    // Return article with filtered content
    // ------------------------
    const articleWithFilteredContent = {
      ...article,
      languages: [languageSpecific],
    };

    // Serialize MongoDB objects to plain objects for client components
    const serializedArticle = serializeMongoObject(
      articleWithFilteredContent
    ) as ISerializedArticle;

    return NextResponse.json(serializedArticle, { status: 200 });
  } catch (error) {
    console.error("Error in route.ts:", error);
    return handleApiError("Get article by slug failed!", error as string);
  }
};
