import { NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { deleteArticle } from "@/app/actions/article/deleteArticle";

// @desc    Delete article by ID
// @route   DELETE /api/v1/articles/by-id/[articleId]
// @access  Private (Author or Admin only)
export const DELETE = async (
  req: Request,
  { params }: { params: { articleId: string } }
) => {
  try {
    // Validate session
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to delete an article",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { articleId } = params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Call the delete article action
    const result = await deleteArticle(
      articleId,
      session.user.id,
      session.user.role === "admin"
    );

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to delete article",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 
                 result.message?.includes("not authorized") ? 403 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message || "Article deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Delete article failed!", error as string);
  }
};
