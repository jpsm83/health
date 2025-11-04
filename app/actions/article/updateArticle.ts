"use server";

import mongoose from "mongoose";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { IArticle, ILanguageSpecific } from "@/types/article";
import { mainCategories } from "@/lib/constants";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";

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
  isAdmin?: boolean;
}

export async function updateArticle({
  articleId,
  category,
  languages,
  imagesContext,
  articleImages,
  userId,
  isAdmin = false,
}: UpdateArticleParams) {
  try {
    // Connect to database
    await connectDb();

    // Find the article
    const existingArticle = await Article.findById(articleId);
    if (!existingArticle) {
      return {
        success: false,
        message: "Article not found",
      };
    }

    // Check authorization - only author or admin can update
    if (existingArticle.createdBy.toString() !== userId && !isAdmin) {
      return {
        success: false,
        message: "You are not authorized to update this article",
      };
    }

    // Validate articleId format
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return {
        success: false,
        message: "Invalid article ID format",
      };
    }

    // Prepare update object
    const updateData: Partial<IArticle> = {};


    // Update category if provided
    if (category) {
      if (!mainCategories.includes(category)) {
        return {
          success: false,
          message: "Invalid category",
        };
      }
      updateData.category = category;
    }

    // Helper function to recursively remove _id fields from objects
    const removeIdFields = (obj: unknown): unknown => {
      if (obj === null || obj === undefined) {
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(removeIdFields);
      }
      
      if (typeof obj === 'object') {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
          // Skip _id fields
          if (key !== '_id') {
            cleaned[key] = removeIdFields(value);
          }
        }
        return cleaned;
      }
      
      return obj;
    };

    // Update languages if provided
    if (languages) {
      // Validate languages structure
      if (!Array.isArray(languages) || languages.length === 0) {
        return {
          success: false,
          message: "Languages must be a non-empty array",
        };
      }

      // Validate each language (no required fields)
      for (const language of languages) {
        // Validate articleContext structure if provided
        if (language.articleContext !== undefined) {
          if (
            typeof language.articleContext !== "string" ||
            language.articleContext.trim().length === 0
          ) {
            return {
              success: false,
              message: "ArticleContext must be a non-empty string",
            };
          }
        }

        // Validate postImage structure if provided
        if (language.postImage !== undefined) {
          if (
            typeof language.postImage !== "string" ||
            language.postImage.trim().length === 0
          ) {
            return {
              success: false,
              message: "PostImage must be a non-empty string",
            };
          }
        }

        // Validate content structure
        if (
          !language.content ||
          !Array.isArray(language.content.articleContents) ||
          language.content.articleContents.length === 0
        ) {
          return {
            success: false,
            message: "Content.articleContents must be a non-empty array",
          };
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
            return {
              success: false,
              message: articleContentValidation,
            };
          }

          // Validate articleParagraphs
          if (
            !Array.isArray(articleContent.articleParagraphs) ||
            articleContent.articleParagraphs.length === 0
          ) {
            return {
              success: false,
              message: "ArticleParagraphs must be a non-empty array",
            };
          }
        }

        // Validate SEO (no required fields)
        // Only validate hreflang enum if provided
        if (language.seo?.hreflang) {
          const supportedLocales = ["en", "pt", "es", "fr", "de", "it"];
          if (!supportedLocales.includes(language.seo.hreflang)) {
            return {
              success: false,
              message: `Unsupported hreflang: ${
                language.seo.hreflang
              }. Supported values: ${supportedLocales.join(", ")}`,
            };
          }
        }
      }

      // Remove _id fields from languages before saving
      updateData.languages = removeIdFields(languages) as ILanguageSpecific[];
    }

    // Update imagesContext if provided
    if (imagesContext) {
      if (
        !imagesContext ||
        !imagesContext.imageOne ||
        !imagesContext.imageTwo ||
        !imagesContext.imageThree ||
        !imagesContext.imageFour
      ) {
        return {
          success: false,
          message:
            "ImagesContext must have imageOne, imageTwo, imageThree, and imageFour",
        };
      }
      // Remove _id fields from imagesContext before saving
      updateData.imagesContext = removeIdFields(imagesContext) as typeof imagesContext;
    }

    // Handle image updates if provided
    if (articleImages && articleImages.length > 0) {
      // Check if we have File objects (for upload) or strings (existing URLs)
      const isFileArray = articleImages.every(item => item instanceof File);
      
      if (isFileArray) {
        // Handle file uploads
        const folder = `/${updateData.category || existingArticle.category}/${articleId}`;

        const cloudinaryUploadResponse = await uploadFilesCloudinary({
          folder,
          filesArr: articleImages as File[],
          onlyImages: true,
        });

        if (
          typeof cloudinaryUploadResponse === "string" ||
          cloudinaryUploadResponse.length === 0 ||
          !cloudinaryUploadResponse.every((str) => str.includes("https://"))
        ) {
          return {
            success: false,
            message: `Error uploading images: ${cloudinaryUploadResponse}`,
          };
        }

        // Add new images to existing ones
        updateData.articleImages = [
          ...(existingArticle.articleImages || []),
          ...cloudinaryUploadResponse,
        ];
      } else {
        // Handle existing URLs - replace all images
        updateData.articleImages = articleImages as string[];
      }
    }

    // Update the article
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return {
        success: false,
        message: "Failed to update article",
      };
    }

    return {
      success: true,
      message: "Article updated successfully",
      article: updatedArticle,
    };
  } catch (error) {
    console.error("Update article error:", error);
    return {
      success: false,
      message: `Update article failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}