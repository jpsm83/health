import { NextResponse } from "next/server";
import { getAllArticlesForDashboard } from "@/app/actions/article/getAllArticlesForDashboard";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "../../auth/[...nextauth]/route";

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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to access dashboard data",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Check admin role
    // ------------------------
    if (session.user.role !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Admin access required",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // ------------------------
    // Get articles using server action
    // ------------------------
    const articles = await getAllArticlesForDashboard();

    // ------------------------
    // Return success response
    // ------------------------
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: articles,
        count: articles.length,
        message: "Dashboard articles retrieved successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Get dashboard articles failed!", error as string);
  }
};
