import { toggleArticleLike } from "@/app/actions/articleLikes";
import { NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import isObjectIdValid from "../../../../utils/isObjectIdValid";

// @desc    Toggle article like (add if not liked, remove if already liked)
// @route   POST /test-actions/article-likes/[articleId]
// @access  Private
export const POST = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  const { articleId } = await context.params;

  // Validate ObjectId
  if (!isObjectIdValid([articleId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // User must be signed in to toggle likes
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to toggle article likes",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const result = await toggleArticleLike(articleId);

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
