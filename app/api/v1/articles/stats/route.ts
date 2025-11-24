import { NextResponse } from "next/server";
import { getWeeklyStats } from "@/app/actions/article/getWeeklyStats";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";;

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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to access statistics",
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
    // Get statistics using server action
    // ------------------------
    const stats = await getWeeklyStats();

    // ------------------------
    // Return success response
    // ------------------------
    return new NextResponse(
      JSON.stringify({
        success: true,
        data: stats,
        message: "Article statistics retrieved successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Get article statistics failed!", error as string);
  }
};
