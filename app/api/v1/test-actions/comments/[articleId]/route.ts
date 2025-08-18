import { createComment, deleteComment } from "@/app/actions/comments";
import { NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/auth";
import isObjectIdValid from "../../../../utils/isObjectIdValid";

// @desc    Create or delete a comment to an article
// @route   POST /test-actions/comments/[articleId]
// @access  Private
export const POST = async (req: Request, context: { params: Promise<{ articleId: string }> }) => {
  const { action, comment, commentId } = await req.json();

  const { articleId } = await context.params;

  // Validate ObjectId
  if (!isObjectIdValid([articleId])) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid article ID format" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if(!action) {
    return new NextResponse(JSON.stringify({ message: "Action is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  if(action === "delete") {
    if(!commentId) {
      return new NextResponse(JSON.stringify({ message: "Comment ID is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  } else if(action === "create") {
    if(!comment) {
      return new NextResponse(JSON.stringify({ message: "Comment is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
  }

  // must be signed in to create or delete a comment
  const session = await auth();

  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to create or delete a comment",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    let result;

    switch (action) {
      case "create":
        result = await createComment(articleId, comment);
        break;
      case "delete":
        result = await deleteComment(articleId, commentId);
        break;
      default:
        return new NextResponse(JSON.stringify({ message: "Invalid action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }

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
}
