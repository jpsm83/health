import { NextRequest, NextResponse } from "next/server";
import { getComments } from "@/app/actions/comment/getComments";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Get comments by article
// @route   GET /api/v1/comments/by-article/[articleId]
// @access  Public
export const GET = async (
  req: NextRequest,
  { params }: { params: { articleId: string } }
) => {
  try {
    const { articleId } = params;
    const { searchParams } = new URL(req.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";
    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await getComments({
      articleId,
      page,
      limit,
      sort,
      order,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to get comments",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: {
          comments: result.comments,
          totalCount: result.totalCount,
          hasMore: result.hasMore,
          page,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Get comments by article failed!", error as string);
  }
};
