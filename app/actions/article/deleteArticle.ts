"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import Article from "@/app/api/models/article";
import Comment from "@/app/api/models/comment";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";

export interface IDeleteArticleResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function deleteArticle(
  articleId: string,
  userId: string,
  isAdmin: boolean = false
): Promise<IDeleteArticleResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([articleId])) {
      return {
        success: false,
        message: "Invalid article ID format!",
      };
    }

    // Connect to database
    await connectDb();

    // Find the article
    const article = await Article.findById(articleId);

    if (!article) {
      return {
        success: false,
        message: "Article not found!",
      };
    }

    // Check authorization - only admin can delete
    if (!isAdmin) {
      return {
        success: false,
        message: "You are not authorized to delete this article! Only administrators can delete articles.",
      };
    }

    // Delete associated comments first
    await Comment.deleteMany({ articleId: articleId });

    // Delete images from Cloudinary
    if (article.articleImages && article.articleImages.length > 0) {
      for (const imageUrl of article.articleImages) {
        try {
          await deleteFilesCloudinary(imageUrl);
        } catch (error) {
          console.warn(`Failed to delete image from Cloudinary: ${imageUrl}`, error);
          // Continue with article deletion even if image deletion fails
        }
      }
    }

    // Delete the article
    await Article.findByIdAndDelete(articleId);

    return {
      success: true,
      message: "Article deleted successfully!",
    };
  } catch (error) {
    console.error("Delete article failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete article failed!",
    };
  }
}
