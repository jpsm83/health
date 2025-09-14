import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { getUserLikedArticles } from "@/app/actions/user/getUserLikedArticles";
import { auth } from "../../../auth/[...nextauth]/route";

// @desc    Get user's liked articles
// @route   GET /api/v1/users/[userId]/liked-articles
// @access  Private (User can only access their own liked articles)
export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    // Validate session
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to view liked articles",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = params;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "User ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is trying to access their own liked articles
    if (session.user.id !== userId) {
      return new NextResponse(
        JSON.stringify({
          message: "You can only access your own liked articles",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const locale = searchParams.get("locale") || "en";

    // Call the get user liked articles action
    const result = await getUserLikedArticles(userId, page, limit, locale);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to fetch liked articles",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: result.data || [],
        totalDocs: result.totalDocs || 0,
        totalPages: result.totalPages || 0,
        currentPage: result.currentPage || page,
        message: result.message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Get user liked articles failed!", error as string);
  }
};
