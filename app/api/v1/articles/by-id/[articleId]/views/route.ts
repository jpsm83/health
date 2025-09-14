import { NextResponse } from "next/server";
import { incrementArticleViews } from "@/app/actions/article/incrementArticleViews";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import { handleApiError } from "@/app/api/utils/handleApiError";

// @desc    Increment article views
// @route   POST /api/v1/articles/by-id/[articleId]/views
// @access  Public
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
    // Increment article views using server action
    // ------------------------
    const result = await incrementArticleViews(articleId);

    // ------------------------
    // Handle server action response
    // ------------------------
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.error || "Failed to increment article views",
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
        views: result.views,
        message: result.message,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError("Increment article views failed!", error as string);
  }
};
