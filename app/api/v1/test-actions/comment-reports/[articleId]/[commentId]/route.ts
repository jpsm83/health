import { auth } from "../../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import isObjectIdValid from "../../../../../utils/isObjectIdValid";
import { reportComment } from "@/app/actions/comment/commentReports";

// @desc    Report a comment
// @route   POST /test-actions/comment-reports/[articleId]/[commentId]
// @access  Private
export const POST = async (
  req: Request,
  context: { params: Promise<{ articleId: string; commentId: string }> }
) => {
  const { articleId, commentId } = await context.params;

  // Validate ObjectIds
  if (!isObjectIdValid([articleId, commentId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID or comment ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // User must be signed in to report comments
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to report comments",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { reason } = await req.json();

    if (!reason) {
      return new NextResponse(
        JSON.stringify({ message: "Report reason is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await reportComment(
      articleId,
      commentId,
      session.user.id,
      reason
    );

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
