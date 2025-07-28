import { NextResponse } from "next/server";
import mongoose from "mongoose";
import equal from "fast-deep-equal";
import { auth } from "../../auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";

// imported models
import Article from "@/app/api/models/article";

// imported interfaces
import { IArticle, IContentsByLanguage } from "@/interfaces/article";

// imported constants
import { mainCategories } from "@/lib/constants";
import deleteFolderCloudinary from "@/lib/cloudinary/deleteFolderCloudinary";

// @desc    Get all articles
// @route   GET /articles
// @access  Public
export const GET = async (
  req: Request,
  context: { params: { articleId: string } }
) => {
  try {
    const { articleId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([articleId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid article ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    const article = await Article.findById(articleId).lean();

    return !article
      ? new NextResponse(JSON.stringify({ message: "No article found!" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      : new NextResponse(JSON.stringify(article), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
  } catch (error) {
    return handleApiError("Get article by articleId failed!", error as string);
  }
};

// @desc    Update article
// @route   PATCH /articles/[articleId]
// @access  Private
export const PATCH = async (
  req: Request,
  context: { params: { articleId: string } }
) => {
  // validate session
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to update an article",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { articleId } = await context.params;

  // Validate ObjectId
  if (!isObjectIdValid([articleId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse FORM DATA instead of JSON because we might have image files
    const formData = await req.formData();

    // Extract basic article fields
    const category = formData.get("category") as string;
    const sourceUrl = formData.get("sourceUrl") as string;
    const contentsByLanguageRaw = formData.get("contentsByLanguage") as string;

    // Validate required fields
    if (!category || !sourceUrl || !contentsByLanguageRaw) {
      return new NextResponse(
        JSON.stringify({
          message: "Category, sourceUrl, and contentsByLanguage are required!",
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

    // Validate source URL
    if (!isValidUrl(sourceUrl)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid source URL!" }),
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
          reqFields: ["language", "mainTitle", "articleContents", "seo"],
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
      for (const articleContent of content.articleContents) {
        const articleContentValidation = objDefaultValidation(
          articleContent as unknown as {
            [key: string]: string | number | boolean | undefined;
          },
          {
            reqFields: ["subTitle", "articleParagraphs"],
            nonReqFields: ["list"],
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
      }

      // Validate seo
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
            "canonicalUrl",
            "type",
          ],
          nonReqFields: ["imagesUrl"],
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
    }

    // Connect to database
    await connectDb();

    const duplicateArticle = await Article.findOne({
      sourceUrl,
      _id: { $ne: articleId },
    });
    if (duplicateArticle) {
      return new NextResponse(
        JSON.stringify({ message: "Article with sourceUrl already exists!" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const article = (await Article.findById(
      articleId
    ).lean()) as IArticle | null;

    if (!article) {
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // check if the article is created by the user
    if (article.createdBy !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to update this article!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate fileEntries
    if (article.articleImages.length !== contentsByLanguage.length) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Number of image files does not match the number of contentsByLanguage!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updateData: Partial<IArticle> = {};

    if (article.category !== category) updateData.category = category;
    if (article.sourceUrl !== sourceUrl) updateData.sourceUrl = sourceUrl;
    if (!equal(article.contentsByLanguage, contentsByLanguage))
      updateData.contentsByLanguage = contentsByLanguage;

    // Update article
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $set: updateData },
      {
        new: true,
        lean: true,
      }
    );

    // check if updatedArticle is undefined
    if (!updatedArticle) {
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Article updated successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Update article failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

// @desc    Delete article
// @route   DELETE /articles/[articleId]
// @access  Private
export const DELETE = async (
  req: Request,
  context: { params: { articleId: string } }
) => {
  // validate session
  const authSession = await auth();

  if (!authSession) {
    return new NextResponse(
      JSON.stringify({ message: "You must be signed in to delete an article" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { articleId } = await context.params;

  // Validate ObjectId
  if (!isObjectIdValid([articleId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID format!" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // connect before first call to DB
  await connectDb();

  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if article exists
    const article = (await Article.findById(
      articleId
    ).lean()) as IArticle | null;

    if (!article) {
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // check if the article is created by the user
    if (article.createdBy !== authSession.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to delete this article!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete article
    const deletedArticle = await Article.deleteOne(
      { _id: articleId },
      { session }
    );

    if (deletedArticle.deletedCount === 0) {
      await session.abortTransaction();
      return new NextResponse(
        JSON.stringify({ message: "Article not found!" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const cloudinaryFolderToDelete = `health/${article.category}/${article._id}`;

    // Delete article folder from cloudinary
    const cloudinaryDeleteResponse = await deleteFolderCloudinary(
      cloudinaryFolderToDelete
    );
    if (cloudinaryDeleteResponse !== true) {
      await session.abortTransaction();
      return new NextResponse(
        JSON.stringify({ message: cloudinaryDeleteResponse }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await session.commitTransaction();

    return new NextResponse(
      JSON.stringify({
        message: "Article deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    await session.abortTransaction();
    return handleApiError(
      "Delete article failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  } finally {
    await session.endSession();
  }
};
