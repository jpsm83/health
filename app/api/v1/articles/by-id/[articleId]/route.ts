import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "../../../auth/[...nextauth]/route";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { deleteArticle } from "@/app/actions/article/deleteArticle";
import { updateArticle } from "@/app/actions/article/updateArticle";
import { checkAuthWithApiKey } from "@/lib/utils/apiKeyAuth";
import { ILanguageSpecific, IArticleLean, ISerializedArticle, serializeMongoObject } from "@/types/article";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// Interface for update parameters
interface UpdateArticleParams {
  articleId: string;
  category?: string;
  languages?: ILanguageSpecific[];
  imagesContext?: {
    imageOne: string;
    imageTwo: string;
    imageThree: string;
    imageFour: string;
  };
  articleImages?: File[] | string[];
  userId: string;
  isAdmin: boolean;
}

// @desc    Get article by ID
// @route   GET /api/v1/articles/by-id/[articleId]
// @access  Public
export const GET = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    const { articleId } = await context.params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate articleId format
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid article ID format",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse query parameters for locale filtering
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get("locale") || "en";

    // Connect to database
    await connectDb();

    // Find article by ID
    const article = await Article.findById(articleId)
      .populate({ path: "createdBy", select: "username", model: User })
      .lean() as IArticleLean | null;

    if (!article) {
      return new NextResponse(
        JSON.stringify({
          message: "Article not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter content by locale if specified
    let languageSpecific: ILanguageSpecific | undefined;
    const languages = article.languages as ILanguageSpecific[];

    // Try to find content for the requested locale
    languageSpecific = languages.find(
      (lang: ILanguageSpecific) => lang.hreflang === locale
    );

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

    // If still no content found, return error
    if (!languageSpecific) {
      return new NextResponse(
        JSON.stringify({
          message: "No content available for the requested locale",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return article with filtered content
    const articleWithFilteredContent = {
      ...article,
      languages: [languageSpecific],
    };

    // Serialize MongoDB objects to plain objects for client components
    const serializedArticle = serializeMongoObject(articleWithFilteredContent) as ISerializedArticle;

    return new NextResponse(
      JSON.stringify({
        message: "Article retrieved successfully",
        article: serializedArticle,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Get article by ID failed!", error as string);
  }
};

// @desc    Update article by ID
// @route   PATCH /api/v1/articles/by-id/[articleId]
// @access  Private (Author or Admin only, Session or API Key)
export const PATCH = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    // Validate session or API key
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    const { articleId } = await context.params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse FORM DATA instead of JSON because we might have image files
    const formData = await req.formData();

    // Extract article fields
    const category = formData.get("category") as string;
    const languagesRaw = formData.get("languages") as string;
    const imagesContextRaw = formData.get("imagesContext") as string;
    
    // Handle articleImages - can be File objects or URL strings
    // Method 1: Upload files (articleImageFiles field)
    // Method 2: Use pre-existing URLs (articleImages field)
    const articleImagesRaw = formData.get("articleImages") as string; // Pre-existing image URLs (JSON array)
    const fileEntries = formData
      .getAll("articleImageFiles")
      .filter((entry): entry is File => entry instanceof File);

    // Prepare update parameters
    const updateParams: UpdateArticleParams = {
      articleId,
      userId: "",
      isAdmin: false,
    };

    // Determine user ID and admin status
    if (session) {
      updateParams.userId = session.user.id;
      updateParams.isAdmin = session.user.role === "admin";
    } else {
      // For API key authentication, use the hardcoded system user ID (same as create endpoint)
      updateParams.userId = "68e6a79afb1932c067f96e30";
      updateParams.isAdmin = true; // API key users are treated as admin
    }

    // Add optional fields if provided
    if (category) {
      updateParams.category = category;
    }

    if (languagesRaw) {
      try {
        const languages = JSON.parse(
          languagesRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
        );
        updateParams.languages = languages;
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid languages format: ${error}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (imagesContextRaw) {
      try {
        const imagesContext = JSON.parse(
          imagesContextRaw.replace(/,\s*}/g, "}").replace(/\s+/g, " ").trim()
        );
        updateParams.imagesContext = imagesContext;
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid imagesContext format: ${error}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Handle image updates - either file uploads OR pre-existing URLs, not both
    const hasFileEntries = fileEntries.length > 0;
    const hasImageUrls = articleImagesRaw && articleImagesRaw.trim() !== "";
    
    if (hasFileEntries && hasImageUrls) {
      return new NextResponse(
        JSON.stringify({
          message: "Cannot use both file uploads and pre-existing URLs for images. Choose one method.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (hasFileEntries) {
      updateParams.articleImages = fileEntries;
    } else if (hasImageUrls) {
      try {
        const imageUrls = JSON.parse(articleImagesRaw);
        if (Array.isArray(imageUrls)) {
          updateParams.articleImages = imageUrls;
        } else {
          return new NextResponse(
            JSON.stringify({
              message: "articleImages must be a JSON array of URLs",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid articleImages format: ${error}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Call the update article action
    const result = await updateArticle(updateParams);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to update article",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 
                 result.message?.includes("not authorized") ? 403 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message || "Article updated successfully",
        article: result.article,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Update article failed!", error as string);
  }
};

// @desc    Delete article by ID
// @route   DELETE /api/v1/articles/by-id/[articleId]
// @access  Private (Author or Admin only, Session or API Key)
export const DELETE = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    // Validate session or API key
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    const { articleId } = await context.params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine user ID and admin status
    let userId: string;
    let isAdmin: boolean;

    if (session) {
      userId = session.user.id;
      isAdmin = session.user.role === "admin";
    } else {
      // For API key authentication, use the hardcoded system user ID (same as create endpoint)
      userId = "68e6a79afb1932c067f96e30";
      isAdmin = true; // API key users are treated as admin
    }

    // Call the delete article action
    const result = await deleteArticle(articleId, userId, isAdmin);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to delete article",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 
                 result.message?.includes("not authorized") ? 403 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message || "Article deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Delete article failed!", error as string);
  }
};