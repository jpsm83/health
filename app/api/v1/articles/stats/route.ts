import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

// @desc    Get article statistics
// @route   GET /api/v1/articles/stats
// @access  Private (Admin only)
export const GET = async () => {
  try {
    // ------------------------
    // Check authentication
    // ------------------------
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to access statistics",
        },
        { status: 401 }
      );
    }

    // ------------------------
    // Check admin role
    // ------------------------
    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    // ------------------------
    // Connect to database
    // ------------------------
    await connectDb();

    // ------------------------
    // Get total articles count
    // ------------------------
    const totalArticles = await Article.countDocuments({});

    // ------------------------
    // Get ALL articles to calculate total stats
    // ------------------------
    const allArticles = await Article.find({}).select("views likes commentsCount");

    // ------------------------
    // Calculate total stats
    // ------------------------
    const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = allArticles.reduce((sum, article) => sum + (article.likes?.length || 0), 0);
    const totalComments = allArticles.reduce((sum, article) => sum + (article.commentsCount || 0), 0);

    const stats = {
      totalArticles,
      totalViews,
      totalLikes,
      totalComments,
    };

    // ------------------------
    // Return success response
    // ------------------------
    return NextResponse.json(
      {
        success: true,
        data: stats,
        message: "Article statistics retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Get article statistics failed!", error as string);
  }
};
