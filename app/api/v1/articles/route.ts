import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";;

// imported utils
import connectDb from "@/app/api/db/connectDb";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { checkAuthWithApiKey } from "@/lib/utils/apiKeyAuth";

// imported models
import Article from "@/app/api/models/article";

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
          return NextResponse.json(
            {
              message:
                "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
            },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          {
            message:
              "Invalid excludeIds format. Must be a JSON array of ObjectIds.",
          },
          { status: 400 }
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
      return NextResponse.json({ message: "No articles found!" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
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
    
    // Image handling - choose ONE method:
    // Method 1: Upload files (articleImageFiles field)
    // Method 2: Use pre-existing URLs (articleImages field)
    const articleImagesRaw = formData.get("articleImages") as string; // Pre-existing image URLs (JSON array)
    const fileEntries = formData
      .getAll("articleImageFiles")
      .filter((entry): entry is File => entry instanceof File);

    // Validate required fields
    if (!category || !languagesRaw || !imagesContextRaw) {
      return NextResponse.json(
        {
          message: "Category, languages, and imagesContext are required!",
        },
        { status: 400 }
      );
    }

    // Validate image input - can use file uploads OR pre-existing URLs, or neither (images optional)
    const hasFileEntries = fileEntries.length > 0;
    const hasImageUrls = articleImagesRaw && articleImagesRaw.trim() !== "";
    
    if (hasFileEntries && hasImageUrls) {
      return NextResponse.json(
        {
          message: "Cannot use both file uploads and pre-existing image URLs. Choose one method.",
        },
        { status: 400 }
      );
    }

    // Note: articleImages are now optional - articles can be created without images
    
    if (!mainCategories.includes(category)) {
      return NextResponse.json(
        { 
          message: `Invalid category: "${category}". Available categories: ${mainCategories.join(", ")}` 
        },
        { status: 400 }
      );
    }

    // Parse and validate pre-existing image URLs if provided
    let articleImages: string[] = [];
    if (hasImageUrls) {
      try {
        articleImages = JSON.parse(articleImagesRaw) as string[];
        
        if (!Array.isArray(articleImages)) {
          return NextResponse.json(
            {
              message: "articleImages must be a valid JSON array!",
            },
            { status: 400 }
          );
        }

        // Accept empty arrays - images are optional
        // Accept any kind of string for articleImages - no validation
      } catch (error) {
        return NextResponse.json(
          {
            message: `Invalid articleImages format: ${error}`,
          },
          { status: 400 }
        );
      }
    }

    // Validate custom ID if provided
    if (customId) {
      // Check if custom ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(customId)) {
        return NextResponse.json(
          { 
            message: "Invalid custom ID format. Must be a valid MongoDB ObjectId." 
          },
          { status: 400 }
        );
      }

      // Check if article with this ID already exists
      await connectDb();
      const existingArticle = await Article.findById(customId);
      if (existingArticle) {
        return NextResponse.json(
          { 
            message: `Article with ID ${customId} already exists. Please use a different ID or update the existing article.` 
          },
          { status: 409 }
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
      return NextResponse.json(
        {
          message: `Invalid imagesContext format: ${error}`,
        },
        { status: 400 }
      );
    }

    // Validate languages structure
    if (!Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json(
        {
          message: "Languages must be a non-empty array!",
        },
        { status: 400 }
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
      return NextResponse.json(
        {
          message:
            "ImagesContext must have imageOne, imageTwo, imageThree, and imageFour!",
        },
        { status: 400 }
      );
    }

    // Validate languages (no required fields)
    for (const language of languages) {
      // Validate articleContext structure if provided
      if (language.articleContext !== undefined) {
        if (
          typeof language.articleContext !== "string" ||
          language.articleContext.trim().length === 0
        ) {
          return NextResponse.json(
            {
              message: "ArticleContext must be a non-empty string!",
            },
            { status: 400 }
          );
        }
      }

      // Validate postImage structure if provided
      if (language.postImage !== undefined) {
        if (
          typeof language.postImage !== "string" ||
          language.postImage.trim().length === 0
        ) {
          return NextResponse.json(
            {
              message: "PostImage must be a non-empty string!",
            },
            { status: 400 }
          );
        }
      }

      // Validate content structure
      if (
        !language.content ||
        !Array.isArray(language.content.articleContents) ||
        language.content.articleContents.length === 0
      ) {
        return NextResponse.json(
          {
            message: "Content.articleContents must be a non-empty array!",
          },
          { status: 400 }
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
          return NextResponse.json(
            {
              message: articleContentValidation,
            },
            { status: 400 }
          );
        }

        // Validate articleParagraphs
        if (
          !Array.isArray(articleContent.articleParagraphs) ||
          articleContent.articleParagraphs.length === 0
        ) {
          return NextResponse.json(
            {
              message: "ArticleParagraphs must be a non-empty array!",
            },
            { status: 400 }
          );
        }
      }

      // Validate SEO (no required fields)
      // Only validate hreflang enum if provided
      if (language.seo?.hreflang) {
        const supportedLocales = ["en", "pt", "es", "fr", "de", "it"];
        if (!supportedLocales.includes(language.seo.hreflang)) {
          return NextResponse.json(
            {
              message: `Unsupported hreflang: ${
                language.seo.hreflang
              }. Supported values: ${supportedLocales.join(", ")}`,
            },
            { status: 400 }
          );
        }
      }

      // Validate salesProducts field if provided (must be an array of strings)
      if (language.salesProducts !== undefined) {
        if (!Array.isArray(language.salesProducts)) {
          return NextResponse.json(
            {
              message: "SalesProducts must be an array of strings!",
            },
            { status: 400 }
          );
        }
        // Validate that all items in the array are strings
        if (!language.salesProducts.every((item) => typeof item === "string")) {
          return NextResponse.json(
            {
              message: "All items in salesProducts array must be strings!",
            },
            { status: 400 }
          );
        }
      }
    }


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
      // For API key authentication, use the hardcoded system user ID
      creatorId = "68e6a79afb1932c067f96e30";
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

    // Handle image uploads - either file uploads OR pre-existing URLs
    if (hasFileEntries) {
      // Upload files to Cloudinary
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
        return NextResponse.json(
          {
            message: `Error uploading image: ${cloudinaryUploadResponse}`,
          },
          { status: 500 }
        );
      }

      newArticle.articleImages = cloudinaryUploadResponse;
    } else if (hasImageUrls) {
      // Use pre-existing image URLs
      newArticle.articleImages = articleImages;
    }

    // Double-check if article already exists right before creation (race condition protection)
    if (customId) {
      const finalCheck = await Article.findById(customId);
      if (finalCheck) {
        return NextResponse.json(
          { 
            message: `Article with ID ${customId} already exists. Please use a different ID or update the existing article.` 
          },
          { status: 409 }
        );
      }
    }

    // Create article in database
    const createdArticle = await Article.create(newArticle);
    return NextResponse.json(
      {
        message: "Article created successfully!",
        article: createdArticle,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError("Create article failed!", error as string);
  }
};
