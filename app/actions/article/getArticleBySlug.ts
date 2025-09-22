"use server";

import { IArticleLean, ISerializedArticle, ILanguageSpecific, serializeMongoObject } from "@/types/article";
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
        "languages.seo.slug": slug,
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
    let languageSpecific: ILanguageSpecific | undefined;

    // Access languages from the lean result
    const languages = article.languages as ILanguageSpecific[];

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

    // If still no content found, return null
    if (!languageSpecific) {
      return null;
    }

    // ------------------------
    // Return article with filtered content (matching route.ts logic)
    // ------------------------
    const articleWithFilteredContent = {
      ...article,
      languages: [languageSpecific],
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
