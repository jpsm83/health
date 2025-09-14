"use server";

import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export const incrementArticleViews = async (articleId: string) => {
  try {
    if (!articleId) {
      throw new Error("Article ID is required");
    }

    await connectDb();

    // Increment the views count using atomic operation
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true, select: "views" } // Return only the views field
    );

    if (!updatedArticle) {
      throw new Error("Article not found");
    }

    return {
      success: true,
      views: updatedArticle.views,
      message: "Article views incremented successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to increment views",
    };
  }
};
