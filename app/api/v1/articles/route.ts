import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { checkAuthWithApiKey } from "@/lib/utils/apiKeyAuth";

// imported models
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// imported interfaces
import {
  IArticle,
  ILanguageSpecific,
  IGetArticlesParams,
} from "@/types/article";

// imported constants
import { mainCategories } from "@/lib/constants";

// imported server actions
import { getArticles } from "@/app/actions/article/getArticles";
import { getArticlesByCategory } from "@/app/actions/article/getArticlesByCategory";

// @desc    Get all articles
// @route   GET /articles
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
    // Decision logic:
    // - If category is provided → use getArticlesByCategory (optimized for category filtering)
    // - If no category → use getArticles (handles general queries, slug filtering, etc.)
    const params: IGetArticlesParams = {
      page,
      limit,
      sort,
      order,
      locale,
      category,
      slug,
      excludeIds: excludeIdsArray,
    };

    let result;

    if (category) {
      // Use getArticlesByCategory when category is specified
      // This action is optimized for category filtering with excludeIds
      result = await getArticlesByCategory({
        ...params,
        category, // Ensure category is explicitly passed
      });
    } else {
      // Use getArticles for general article fetching (no category filter)
      // This action handles slug filtering and general queries
      result = await getArticles(params);
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
    return handleApiError("Get all articles failed!", error as string);
  }
};

// @desc    Create new article
// @route   POST /articles
// @access  Private (Session or API Key)
export const POST = async (req: Request) => {
  // validate session or API key
  const session = await auth();
  const authError = checkAuthWithApiKey(req, session);
  
  if (authError) {
    return authError;
  }

  try {
    // Parse FORM DATA instead of JSON because we might have image files
    const formData = await req.formData();

    // Extract basic article fields
    const category = formData.get("category") as string;
    const languagesRaw = formData.get("languages") as string;
    const imagesContextRaw = formData.get("imagesContext") as string;
    const customId = formData.get("id") as string; // Optional custom ID
    const fileEntries = formData
      .getAll("articleImages")
      .filter((entry): entry is File => entry instanceof File);

    // Validate required fields
    if (!category || !languagesRaw || !imagesContextRaw) {
      return new NextResponse(
        JSON.stringify({
          message: "Category, languages, and imagesContext are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate category
    if (!mainCategories.includes(category)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid category!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate custom ID if provided
    if (customId) {
      // Check if custom ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(customId)) {
        return new NextResponse(
          JSON.stringify({ 
            message: "Invalid custom ID format. Must be a valid MongoDB ObjectId." 
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if article with this ID already exists
      await connectDb();
      const existingArticle = await Article.findById(customId);
      if (existingArticle) {
        return new NextResponse(
          JSON.stringify({ 
            message: `Article with ID ${customId} already exists. Please use a different ID or update the existing article.` 
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Parse languages from formData
    const languages: ILanguageSpecific[] = JSON.parse(
      languagesRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
    ) as ILanguageSpecific[];

    let imagesContext;

    try {
      imagesContext = JSON.parse(
        imagesContextRaw.replace(/,\s*}/g, "}").replace(/\s+/g, " ").trim()
      ) as {
        imageOne: string;
        imageTwo: string;
        imageThree: string;
        imageFour: string;
      };
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          message: `Invalid imagesContext format: ${error}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate languages structure
    if (!Array.isArray(languages) || languages.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "Languages must be a non-empty array!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate imagesContext structure
    if (
      !imagesContext ||
      !imagesContext.imageOne ||
      !imagesContext.imageTwo ||
      !imagesContext.imageThree ||
      !imagesContext.imageFour
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "ImagesContext must have imageOne, imageTwo, imageThree, and imageFour!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate languages
    for (const language of languages) {
      const languageValidation = objDefaultValidation(
        language as unknown as {
          [key: string]: string | number | boolean | undefined;
        },
        {
          reqFields: ["hreflang", "canvas", "seo", "content"],
          nonReqFields: ["socialMedia"],
        }
      );

      if (languageValidation !== true) {
        return new NextResponse(
          JSON.stringify({
            message: languageValidation,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate canvas structure
      if (
        !language.canvas ||
        !language.canvas.paragraphOne ||
        !language.canvas.paragraphTwo ||
        !language.canvas.paragraphThree
      ) {
        return new NextResponse(
          JSON.stringify({
            message:
              "Canvas must have paragraphOne, paragraphTwo, and paragraphThree!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate content structure
      if (
        !language.content ||
        !Array.isArray(language.content.articleContents) ||
        language.content.articleContents.length === 0
      ) {
        return new NextResponse(
          JSON.stringify({
            message: "Content.articleContents must be a non-empty array!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate each articleContent
      for (const articleContent of language.content.articleContents) {
        const articleContentValidation = objDefaultValidation(
          articleContent as unknown as {
            [key: string]: string | number | boolean | undefined;
          },
          {
            reqFields: ["subTitle", "articleParagraphs"],
            nonReqFields: [],
          }
        );

        if (articleContentValidation !== true) {
          return new NextResponse(
            JSON.stringify({
              message: articleContentValidation,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate articleParagraphs
        if (
          !Array.isArray(articleContent.articleParagraphs) ||
          articleContent.articleParagraphs.length === 0
        ) {
          return new NextResponse(
            JSON.stringify({
              message: "ArticleParagraphs must be a non-empty array!",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      // Validate SEO
      const seoValidationResult = objDefaultValidation(
        language.seo as unknown as {
          [key: string]: string | number | boolean | undefined;
        },
        {
          reqFields: [
            "metaTitle",
            "metaDescription",
            "keywords",
            "slug",
            "hreflang",
            "urlPattern",
            "canonicalUrl",
          ],
          nonReqFields: [],
        }
      );

      if (seoValidationResult !== true) {
        return new NextResponse(
          JSON.stringify({
            message: seoValidationResult,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate hreflang is supported
      const supportedLocales = ["en", "pt", "es", "fr", "de", "it"];
      if (!supportedLocales.includes(language.seo.hreflang)) {
        return new NextResponse(
          JSON.stringify({
            message: `Unsupported hreflang: ${
              language.seo.hreflang
            }. Supported values: ${supportedLocales.join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate urlPattern is valid (now required)
      const validUrlPatterns = [
        "articles",
        "artigos",
        "articulos",
        "artikel",
        "articoli",
        "artikelen",
      ];
      if (!validUrlPatterns.includes(language.seo.urlPattern)) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid URL pattern: ${
              language.seo.urlPattern
            }. Supported patterns: ${validUrlPatterns.join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // // Validate fileEntries
    // if (
    //   !fileEntries.length ||
    //   // fileEntries.length !== languages[0].content.articleContents.length ||
    //   fileEntries.some((file) => file.size === 0)
    // ) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       message:
    //         "No image files found or the number of image files does not match the number of article contents!",
    //     }),
    //     { status: 400, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    // Connect to database (if not already connected from custom ID validation)
    if (!customId) {
      await connectDb();
    }

    // Determine the creator ID
    let creatorId: string;
    if (session) {
      // Use session user ID
      creatorId = session.user.id;
    } else {
      // For API key authentication, we need to find a default admin user
      // or use a system user ID. For now, we'll look for an admin user.
      const adminUser = await User.findOne({ role: "admin" }).select("_id").lean() as { _id: string } | null;
      if (!adminUser || !adminUser._id) {
        return new NextResponse(
          JSON.stringify({
            message: "No admin user found for API key authentication",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      creatorId = adminUser._id.toString();
    }

    // Use custom ID if provided, otherwise generate new one
    const articleId = customId ? new mongoose.Types.ObjectId(customId) : new mongoose.Types.ObjectId();

    // Prepare article for creation
    const newArticle: IArticle = {
      _id: articleId,
      languages,
      category: category,
      imagesContext,
      articleImages: [],
      createdBy: creatorId,
    };

    // Upload images to Cloudinary
    if (
      fileEntries?.every((file) => file instanceof File && file.size > 0) &&
      fileEntries.length > 0
    ) {
      const folder = `/${category}/${articleId}`;

      const cloudinaryUploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: fileEntries,
        onlyImages: true,
      });

      if (
        typeof cloudinaryUploadResponse === "string" ||
        cloudinaryUploadResponse.length === 0 ||
        !cloudinaryUploadResponse.every((str) => str.includes("https://"))
      ) {
        return new NextResponse(
          JSON.stringify({
            message: `Error uploading image: ${cloudinaryUploadResponse}`,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      newArticle.articleImages = cloudinaryUploadResponse;
    }

    // Create article in database
    const createdArticle = await Article.create(newArticle);
    return new NextResponse(
      JSON.stringify({
        message: "Article created successfully!",
        article: createdArticle,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Create article failed!", error as string);
  }
};
