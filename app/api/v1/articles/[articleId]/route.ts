import { NextResponse } from "next/server";
import mongoose from "mongoose";
import equal from "fast-deep-equal";
import { auth } from "../../auth/[...nextauth]/route";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";

// imported models
import Article from "@/app/api/models/article";

// imported interfaces
import { IArticle, IContentsByLanguage } from "@/interfaces/article";

// imported constants
import { mainCategories, languageConfig } from "@/lib/constants";
import deleteFolderCloudinary from "@/lib/cloudinary/deleteFolderCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";

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
            "hreflang",
            "urlPattern",
            "canonicalUrl",
            "type",
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
      if (!(content.seo.hreflang in languageConfig)) {
        return new NextResponse(
          JSON.stringify({
            message: `Unsupported hreflang: ${
              content.seo.hreflang
            }. Supported values: ${Object.keys(languageConfig).join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate urlPattern matches the hreflang configuration
      const config =
        languageConfig[content.seo.hreflang as keyof typeof languageConfig];
      if (content.seo.urlPattern !== config.urlPattern) {
        return new NextResponse(
          JSON.stringify({
            message: `URL pattern '${content.seo.urlPattern}' does not match the expected pattern '${config.urlPattern}' for hreflang '${content.seo.hreflang}'`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Connect to database
    await connectDb();

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
    if (article.createdBy.toString() !== session.user.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You are not authorized to update this article!",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for duplicate slugs across all languages (excluding current article)
    const slugs = contentsByLanguage.map((content) => content.seo.slug);

    // Check if any of the slugs already exist in other articles
    const duplicateArticle = await Article.findOne({
      "contentsByLanguage.seo.slug": { $in: slugs },
      _id: { $ne: articleId }, // Exclude current article
    });

    if (duplicateArticle) {
      return new NextResponse(
        JSON.stringify({
          message: `Article with slug(s) already exists: ${slugs.join(", ")}`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle image uploads if new files are provided
    let newArticleImages: string[] = [];

    if (fileEntries.length > 0) {
      // Validate fileEntries
      if (
        fileEntries.length !== contentsByLanguage[0].articleContents.length ||
        fileEntries.some((file) => file.size === 0)
      ) {
        return new NextResponse(
          JSON.stringify({
            message:
              "Number of image files does not match the number of contentsByLanguage!",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check which images are new vs existing
      const existingImages = article.articleImages || [];
      const newImages: File[] = [];
      const imagesToKeep: string[] = [];

      // Process each file entry to determine if it's new or existing
      for (let i = 0; i < fileEntries.length; i++) {
        const file = fileEntries[i];
        const existingImageUrl = existingImages[i];

        // Check if this is a valid new image file
        if (file && file.size > 0 && file.type.startsWith("image/")) {
          // This is a new image, add it to upload list
          newImages.push(file);
          // We'll add a placeholder for now, will be replaced after upload
          imagesToKeep.push(""); // Placeholder
        } else if (existingImageUrl) {
          // No new image for this position, keep the existing one
          imagesToKeep.push(existingImageUrl);
        } else {
          // No image for this position and no existing image
          imagesToKeep.push("");
        }
      }

      // Upload only new images to Cloudinary
      if (newImages.length > 0) {
        const folder = `/${category}/${articleId}`;

        const cloudinaryUploadResponse = await uploadFilesCloudinary({
          folder,
          filesArr: newImages,
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
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Replace placeholders with actual uploaded URLs
        let uploadIndex = 0;
        for (let i = 0; i < imagesToKeep.length; i++) {
          if (imagesToKeep[i] === "") {
            imagesToKeep[i] = cloudinaryUploadResponse[uploadIndex];
            uploadIndex++;
          }
        }
      }

      newArticleImages = imagesToKeep;
    }

    // If no new images were uploaded, keep existing ones
    if (fileEntries.length === 0) {
      newArticleImages = article.articleImages || [];
    }

    // Validate that we have the correct number of images
    if (
      newArticleImages.length !== contentsByLanguage[0].articleContents.length
    ) {
      return new NextResponse(
        JSON.stringify({
          message: "Image count mismatch after processing. Please try again.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Filter out any empty strings (shouldn't happen with proper validation, but safety check)
    newArticleImages = newArticleImages.filter(
      (img) => img && img.trim() !== ""
    );

    // Delete old images that are no longer needed
    if (fileEntries.length > 0) {
      const existingImages = article.articleImages || [];
      const imagesToDelete: string[] = [];

      // Find images that exist in the old array but not in the new one
      for (const existingImage of existingImages) {
        if (!newArticleImages.includes(existingImage)) {
          imagesToDelete.push(existingImage);
        }
      }

      // Also check if we have fewer images now than before
      if (newArticleImages.length < existingImages.length) {
        // Add any images beyond the new count to deletion list
        for (let i = newArticleImages.length; i < existingImages.length; i++) {
          if (
            existingImages[i] &&
            !imagesToDelete.includes(existingImages[i])
          ) {
            imagesToDelete.push(existingImages[i]);
          }
        }
      }

      // Delete old images from Cloudinary
      if (imagesToDelete.length > 0) {
        // Extract public IDs from Cloudinary URLs for deletion
        const publicIds = imagesToDelete
          .map((url) => {
            // Extract public ID from Cloudinary URL
            // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image_name.jpg
            const urlParts = url.split("/");
            const uploadIndex = urlParts.findIndex((part) => part === "upload");
            if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
              // Skip 'v1234567890' and get the folder + filename
              const folderAndFile = urlParts.slice(uploadIndex + 2).join("/");
              // Remove file extension
              return folderAndFile.replace(/\.[^/.]+$/, "");
            }
            return null;
          })
          .filter((id) => id !== null);

        // Delete files from Cloudinary
        if (publicIds.length > 0) {
          try {
            // Delete each file individually
            for (const publicId of publicIds) {
              if (publicId) {
                // Reconstruct the full Cloudinary URL for deletion
                const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
                await deleteFilesCloudinary(cloudinaryUrl);
              }
            }
          } catch (deleteError) {
            console.error(
              "Error deleting old images from Cloudinary:",
              deleteError
            );
            // Don't fail the update if deletion fails, just log it
          }
        }
      }
    }

    const updateData: Partial<IArticle> = {};

    if (article.category !== category) updateData.category = category;
    if (!equal(article.contentsByLanguage, contentsByLanguage))
      updateData.contentsByLanguage = contentsByLanguage;

    // Always update articleImages (either new ones or existing ones)
    updateData.articleImages = newArticleImages;

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
  // authSession is the USER session logged in
  // session is the MONGOOSE session to handle all transactions at once
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

  // authSession is the USER session logged in
  // session is the MONGOOSE session to handle all transactions at once
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
    if (article.createdBy.toString() !== authSession.user.id) {
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
