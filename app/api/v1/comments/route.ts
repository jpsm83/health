import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/route";
import { createComment } from "@/app/actions/comment/createComment";
import { getComments as getCommentsAction } from "@/app/actions/comment/getComments";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Get comments
// @route   GET /api/v1/comments
// @access  Public
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    
    const articleId = searchParams.get("articleId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") as "asc" | "desc") || "desc";

    const result = await getCommentsAction({
      articleId,
      userId,
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
    return handleApiError("Get comments failed!", error as string);
  }
};

// @desc    Create comment
// @route   POST /api/v1/comments
// @access  Private
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to create a comment",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { articleId, comment } = await req.json();

    if (!articleId || !comment) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Article ID and comment are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await createComment({
      articleId,
      userId: session.user.id,
      comment,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to create comment",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: result.comment,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Create comment failed!", error as string);
  }
};
