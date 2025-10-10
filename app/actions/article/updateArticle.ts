"use server";

import mongoose from "mongoose";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { IArticle, ILanguageSpecific } from "@/types/article";
import { mainCategories } from "@/lib/constants";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";

// Helper function to validate video URLs
function isValidVideoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    const pathname = urlObj.pathname.toLowerCase();
    return videoExtensions.some(ext => pathname.endsWith(ext)) || 
           url.includes('youtube.com') || 
           url.includes('vimeo.com') ||
           url.includes('cloudinary.com');
  } catch {
    return false;
  }
}

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
  articleImages?: File[];
  articleVideo?: string;
  userId: string;
  isAdmin?: boolean;
}

export async function updateArticle({
  articleId,
  category,
  languages,
  imagesContext,
  articleImages,
  articleVideo,
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

    // Update languages if provided
    if (languages) {
      // Validate languages structure
      if (!Array.isArray(languages) || languages.length === 0) {
        return {
          success: false,
          message: "Languages must be a non-empty array",
        };
      }

      // Validate each language
      for (const language of languages) {
        const languageValidation = objDefaultValidation(
          language as unknown as {
            [key: string]: string | number | boolean | undefined;
          },
          {
            reqFields: ["hreflang", "mediaContext", "seo", "content"],
            nonReqFields: ["socialMedia"],
          }
        );

        if (languageValidation !== true) {
          return {
            success: false,
            message: languageValidation,
          };
        }

        // Validate mediaContext structure
        if (
          !language.mediaContext ||
          !language.mediaContext.paragraphOne ||
          !language.mediaContext.paragraphTwo ||
          !language.mediaContext.paragraphThree
        ) {
          return {
            success: false,
            message:
              "MediaContext must have paragraphOne, paragraphTwo, and paragraphThree",
          };
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
          return {
            success: false,
            message: seoValidationResult,
          };
        }

        // Validate hreflang is supported
        const supportedLocales = ["en", "pt", "es", "fr", "de", "it"];
        if (!supportedLocales.includes(language.seo.hreflang)) {
          return {
            success: false,
            message: `Unsupported hreflang: ${
              language.seo.hreflang
            }. Supported values: ${supportedLocales.join(", ")}`,
          };
        }

        // Validate urlPattern is valid
        const validUrlPatterns = [
          "articles",
          "artigos",
          "articulos",
          "artikel",
          "articoli",
          "artikelen",
        ];
        if (!validUrlPatterns.includes(language.seo.urlPattern)) {
          return {
            success: false,
            message: `Invalid URL pattern: ${
              language.seo.urlPattern
            }. Supported patterns: ${validUrlPatterns.join(", ")}`,
          };
        }
      }

      updateData.languages = languages;
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
      updateData.imagesContext = imagesContext;
    }

    // Update articleVideo if provided
    if (articleVideo) {
      if (!isValidVideoUrl(articleVideo)) {
        return {
          success: false,
          message: "Invalid video URL format",
        };
      }
      updateData.articleVideo = articleVideo;
    }

    // Handle image uploads if provided
    if (articleImages && articleImages.length > 0) {
      const folder = `/${updateData.category || existingArticle.category}/${articleId}`;

      const cloudinaryUploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: articleImages,
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
