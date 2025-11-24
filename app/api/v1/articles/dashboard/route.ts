import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import connectDb from "@/app/api/db/connectDb";
import { fieldProjections } from "@/app/api/utils/fieldProjections";
import Article from "@/app/api/models/article";
import { ISerializedArticle, serializeMongoObject } from "@/types/article";

// @desc    Get all articles for dashboard
// @route   GET /api/v1/articles/dashboard
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
          message: "You must be signed in to access dashboard data",
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
    // Get articles with dashboard projection
    // ------------------------
    const articles = await Article.find({}, fieldProjections.dashboard)
      .populate({ path: "createdBy", select: "username" })
      .sort({ createdAt: -1 })
      .lean();

    // ------------------------
    // Serialize MongoDB objects
    // ------------------------
    const serializedArticles = articles.map(
      (article): ISerializedArticle => {
        return serializeMongoObject(article) as ISerializedArticle;
      }
    );

    // ------------------------
    // Return success response
    // ------------------------
    return NextResponse.json(
      {
        success: true,
        data: serializedArticles,
        count: serializedArticles.length,
        message: "Dashboard articles retrieved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Get dashboard articles failed!", error as string);
  }
};
