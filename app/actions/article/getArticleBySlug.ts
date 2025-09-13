"use server";

import { IArticleLean, ISerializedArticle, IContentsByLanguage, serializeMongoObject } from "@/interfaces/article";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

export async function getArticleBySlug(slug: string, locale = "en"): Promise<ISerializedArticle | null> {
  try {
    await connectDb();

    // ------------------------
    // Validate slug parameter (matching route.ts logic)
    // ------------------------
    if (!slug || typeof slug !== "string") {
      throw new Error("Valid slug parameter is required!");
    }

    // ------------------------
    // Query DB for article by slug (matching route.ts logic)
    // ------------------------
    let article: IArticleLean | null;
    try {
      article = await Article.findOne({
        "contentsByLanguage.seo.slug": slug,
      })
        .populate({ path: "createdBy", select: "username", model: User })
        .lean() as IArticleLean | null;
    } catch (dbError) {
      console.error("Database query failed:", dbError);
      throw new Error(`Database query failed: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
    }
    
    // ------------------------
    // Handle no results (matching route.ts logic)
    // ------------------------
    if (!article) {
      return null;
    }

    // ------------------------
    // Post-process by locale (matching route.ts logic)
    // ------------------------
    let contentByLanguage: IContentsByLanguage | undefined;

    // Access contentsByLanguage from the lean result
    const contentsByLanguage = article.contentsByLanguage as IContentsByLanguage[];

    // Try to find content for the requested slug first
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

    // If still no content found, return null
    if (!contentByLanguage) {
      return null;
    }

    // ------------------------
    // Return article with filtered content (matching route.ts logic)
    // ------------------------
    const articleWithFilteredContent = {
      ...article,
      contentsByLanguage: [contentByLanguage],
    };

    // Serialize MongoDB objects to plain objects for client components
    const serializedArticle = serializeMongoObject(articleWithFilteredContent) as ISerializedArticle;

    return serializedArticle;
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    // Return null instead of throwing error (matching service behavior)
    return null;
  }
}
