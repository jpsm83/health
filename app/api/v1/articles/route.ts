import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "../auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import { handleApiError } from "@/app/api/utils/handleApiError";

// imported models
import Article from "@/app/api/models/article";

// imported interfaces
import { IArticle, IContentsByLanguage, IGetArticlesParams } from "@/types/article";

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
// @access  Private
export const POST = async (req: Request) => {
  // validate session
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to create an article",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse FORM DATA instead of JSON because we might have image files
    const formData = await req.formData();

    // Extract basic article fields
    const category = formData.get("category") as string;
    const contentsByLanguageRaw = formData.get("contentsByLanguage") as string;
    const fileEntries = formData
      .getAll("articleImages")
      .filter((entry): entry is File => entry instanceof File);

    // Validate required fields
    if (!category || !contentsByLanguageRaw) {
      return new NextResponse(
        JSON.stringify({
          message: "Category and contentsByLanguage are required!",
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

    // Parse contentsByLanguage from formData
    const contentsByLanguage: IContentsByLanguage[] = JSON.parse(
      contentsByLanguageRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
    ) as IContentsByLanguage[];

    // Validate contentsByLanguage structure
    if (!Array.isArray(contentsByLanguage) || contentsByLanguage.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "ContentsByLanguage must be a non-empty array!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate contentsByLanguage
    for (const content of contentsByLanguage) {
      const contentByLanguageValidation = objDefaultValidation(
        content as unknown as {
          [key: string]: string | number | boolean | undefined;
        },
        {
          reqFields: ["mainTitle", "articleContents", "seo"],
          nonReqFields: [],
        }
      );

      if (contentByLanguageValidation !== true) {
        return new NextResponse(
          JSON.stringify({
            message: contentByLanguageValidation,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate articleContents
      if (
        !Array.isArray(content.articleContents) ||
        content.articleContents.length === 0
      ) {
        return new NextResponse(
          JSON.stringify({
            message: "ArticleContents must be a non-empty array!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate each articleContent
      for (const articleContent of content.articleContents) {
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
        content.seo as unknown as {
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
      const supportedLocales = [
        "en",
        "pt",
        "es",
        "fr",
        "de",
        "it",
        "nl",
        "he",
        "ru",
      ];
      if (!supportedLocales.includes(content.seo.hreflang)) {
        return new NextResponse(
          JSON.stringify({
            message: `Unsupported hreflang: ${
              content.seo.hreflang
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
        "מאמרים",
      ];
      if (!validUrlPatterns.includes(content.seo.urlPattern)) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid URL pattern: ${
              content.seo.urlPattern
            }. Supported patterns: ${validUrlPatterns.join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Validate fileEntries
    if (
      !fileEntries.length ||
      fileEntries.length !== contentsByLanguage[0].articleContents.length ||
      fileEntries.some((file) => file.size === 0)
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "No image files found or the number of image files does not match the number of contentsByLanguage!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to database
    await connectDb();

    // Check for duplicate slugs across all languages
    const slugs = contentsByLanguage.map((content) => content.seo.slug);

    // Check if any of the slugs already exist in the database
    const duplicateArticle = await Article.findOne({
      "contentsByLanguage.seo.slug": { $in: slugs },
    });

    if (duplicateArticle) {
      return new NextResponse(
        JSON.stringify({
          message: `Article with slug(s) already exists: ${slugs.join(", ")}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const articleId = new mongoose.Types.ObjectId();

    // Prepare article for creation
    const newArticle: IArticle = {
      _id: articleId,
      contentsByLanguage,
      category: category,
      articleImages: [],
      createdBy: session.user.id,
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
