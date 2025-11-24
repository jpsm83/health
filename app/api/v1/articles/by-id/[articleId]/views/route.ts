import { NextResponse } from "next/server";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

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
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid article ID format" 
        },
        { status: 400 }
      );
    }

    // ------------------------
    // Connect to database
    // ------------------------
    await connectDb();

    // ------------------------
    // Increment the views count using atomic operation
    // ------------------------
    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true, select: "views" } // Return only the views field
    );

    if (!updatedArticle) {
      return NextResponse.json(
        {
          success: false,
          message: "Article not found",
        },
        { status: 404 }
      );
    }

    // ------------------------
    // Return success response
    // ------------------------
    return NextResponse.json(
      {
        success: true,
        views: updatedArticle.views,
        message: "Article views incremented successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Increment article views failed!", error as string);
  }
};
