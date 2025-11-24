import { NextResponse } from "next/server";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";

// @desc    Toggle article like (add if not liked, remove if already liked)
// @route   POST /api/v1/likes/articles/[articleId]
// @access  Private
export const POST = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    const { articleId } = await context.params;

    // ------------------------
    // Validate articleId format
    // ------------------------
    if (!isObjectIdValid([articleId])) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Invalid article ID format" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Check authentication
    // ------------------------
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to toggle article likes",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Connect to database
    // ------------------------
    await connectDb();

    // ------------------------
    // Check if user already liked the article
    // ------------------------
    const article = await Article.findById(articleId);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    const userLiked = article.likes?.includes(session.user.id);

    // ------------------------
    // Toggle like status using atomic operation
    // ------------------------
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      userLiked
        ? { $pull: { likes: session.user.id } } // Remove like
        : { $addToSet: { likes: session.user.id } }, // Add like (prevents duplicates)
      { new: true }
    );

    if (!updatedArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update article like",
        },
        { status: 400 }
      );
    }

    // ------------------------
    // Update user's likedArticles array
    // ------------------------
    await User.findByIdAndUpdate(
      session.user.id,
      userLiked
        ? { $pull: { likedArticles: articleId } } // Remove from user's liked articles
        : { $addToSet: { likedArticles: articleId } }, // Add to user's liked articles
      { new: true }
    );

    // ------------------------
    // Return success response
    // ------------------------
    return NextResponse.json(
      {
        success: true,
        liked: !userLiked, // Return new like status
        likeCount: updatedArticle.likes?.length || 0,
        message: userLiked ? "Article unliked" : "Article liked",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Toggle article like failed!", error as string);
  }
};

// @desc    Get article like status and count
// @route   GET /api/v1/likes/articles/[articleId]
// @access  Public
export const GET = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    const { articleId } = await context.params;

    // ------------------------
    // Validate articleId format
    // ------------------------
    if (!isObjectIdValid([articleId])) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Invalid article ID format" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Get article like information
    // ------------------------
    const session = await auth();
    const userId = session?.user?.id;

    // Import Article model for direct query
    const { default: connectDb } = await import("@/app/api/db/connectDb");
    const { default: Article } = await import("@/app/api/models/article");
    
    await connectDb();
    
    const article = await Article.findById(articleId).select("likes");
    
    if (!article) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Article not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const likeCount = article.likes?.length || 0;
    const userLiked = userId ? article.likes?.includes(userId) : false;

    return new NextResponse(
      JSON.stringify({
        success: true,
        likeCount,
        userLiked,
        message: "Article like status retrieved successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Get article like status failed!", error as string);
  }
};
