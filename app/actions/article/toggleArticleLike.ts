"use server";

import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

export const toggleArticleLike = async (articleId: string, userId: string) => {
  try {
    if (!userId) {
      throw new Error("You must be signed in to like articles");
    }

    await connectDb();

    // Check if user already liked the article
    const article = await Article.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    const userLiked = article.likes?.includes(userId);

    // Toggle like status using atomic operation
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      userLiked
        ? { $pull: { likes: userId } } // Remove like
        : { $addToSet: { likes: userId } }, // Add like (prevents duplicates)
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error("Failed to update article like");
    }

    // Revalidate the page to show updated like count
    // Fixed: Added 'page' type parameter to avoid warning
    // Temporarily disable revalidatePath to fix stack overflow
    // revalidatePath(`/[locale]/[category]/[slug]`, "page");

    return {
      success: true,
      liked: !userLiked, // Return new like status
      likeCount: updatedArticle.likes?.length || 0,
      message: userLiked ? "Article unliked" : "Article liked",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
};
