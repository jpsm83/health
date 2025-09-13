import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { deleteComment } from "@/app/actions/comment/deleteComment";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Delete comment
// @route   DELETE /api/v1/comments/[commentId]
// @access  Private
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { commentId: string } }
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to delete comments",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { commentId } = params;

    if (!commentId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Comment ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await deleteComment({
      commentId,
      userId: session.user.id,
      isAdmin: session.user.role === "admin",
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to delete comment",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Comment deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Delete comment failed!", error as string);
  }
};
