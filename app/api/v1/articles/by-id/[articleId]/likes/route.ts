import { NextResponse } from "next/server";
import { toggleArticleLike } from "@/app/actions/article/toggleArticleLike";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/auth";

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
    // Toggle article like using server action
    // ------------------------
    const result = await toggleArticleLike(articleId, session.user.id);

    // ------------------------
    // Handle server action response
    // ------------------------
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to toggle article like",
        }),
        { 
          status: result.error?.includes("not found") ? 404 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    // ------------------------
    // Return success response
    // ------------------------
    return new NextResponse(
      JSON.stringify({
        success: true,
        liked: result.liked,
        likeCount: result.likeCount,
        message: result.message,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
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
