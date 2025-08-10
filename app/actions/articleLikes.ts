"use server";

import { auth } from "@/app/api/v1/auth/[...nextauth]/route";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { revalidatePath } from "next/cache";

export const toggleArticleLike = async (articleId: string) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("You must be signed in to like articles");
    }

    await connectDb();

    // Check if user already liked the article
    const article = await Article.findById(articleId);

    if (!article) {
      throw new Error("Article not found");
    }

    const userLiked = article.likes?.includes(session.user.id);

    // Toggle like status using atomic operation
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      userLiked
        ? { $pull: { likes: session.user.id } } // Remove like
        : { $addToSet: { likes: session.user.id } }, // Add like (prevents duplicates)
      { new: true }
    );

    if (!updatedArticle) {
      throw new Error("Failed to update article like");
    }

    // Revalidate the page to show updated like count
    // Fixed: Added 'page' type parameter to avoid warning
    revalidatePath(`/article/[lang]/[slug]`, "page");

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
