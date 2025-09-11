import { NextResponse } from "next/server";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported models
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// imported interfaces
import { IContentsByLanguage } from "@/interfaces/article";

// @desc    Get article by slug
// @route   GET /articles/[slug]
// @access  Public
export const GET = async (
  req: Request,
  { params }: { params: { slug: string } }
) => {
  try {
    await connectDb();

    const { slug } = params;
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    // Validate slug parameter
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
    // Query DB for article by slug
    // ------------------------
    let article;
    try {
      article = await Article.findOne({
        "contentsByLanguage.seo.slug": slug,
      })
        .populate({ path: "createdBy", select: "username", model: User })
        .populate({ 
          path: "comments.userId", 
          select: "username imageUrl", 
          model: User 
        })
        .lean();
    } catch (dbError) {
      console.error("Database query failed:", dbError);
      throw new Error(`Database query failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }
    
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

    // ------------------------
    // Post-process by locale
    // ------------------------
    let contentByLanguage: IContentsByLanguage | undefined;

    // Access contentsByLanguage from the lean result
    const contentsByLanguage = (article as Record<string, unknown>)
      .contentsByLanguage as IContentsByLanguage[];

    // Try to find content for the requested locale
    contentByLanguage = contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.slug === slug
    );

    // If not found by slug, try by locale
    if (!contentByLanguage) {
      contentByLanguage = contentsByLanguage.find(
        (content: IContentsByLanguage) => content.seo.hreflang === locale
      );
    }

    // Fallback to English if locale not found
    if (!contentByLanguage && locale !== "en") {
      contentByLanguage = contentsByLanguage.find(
        (content: IContentsByLanguage) => content.seo.hreflang === "en"
      );
    }

    // Final fallback: first available
    if (!contentByLanguage && contentsByLanguage.length > 0) {
      contentByLanguage = contentsByLanguage[0];
    }

    // If still no content found, return error
    if (!contentByLanguage) {
      return new NextResponse(
        JSON.stringify({ message: "No content found for this article!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ------------------------
    // Return article with filtered content
    // ------------------------
    const articleWithFilteredContent = {
      ...article,
      contentsByLanguage: [contentByLanguage],
    };

    return new NextResponse(JSON.stringify(articleWithFilteredContent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in rote.ts:", error);
    return handleApiError("Get article by slug failed!", error as string);
  }
};
