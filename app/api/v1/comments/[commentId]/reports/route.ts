import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { reportCommentService } from "@/lib/services/comments";
import Comment from "@/app/api/models/comment";
import User from "@/app/api/models/user";
import sendCommentReportEmailAction from "@/app/actions/user/commentReport";

// @desc    Report comment
// @route   POST /api/v1/comments/[commentId]/reports
// @access  Private
export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ commentId: string }> }
) => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "You must be signed in to report comments",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { commentId } = await context.params;
    const { reason } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Comment ID is required",
        },
        { status: 400 }
      );
    }

    if (!reason) {
      return NextResponse.json(
        {
          success: false,
          message: "Report reason is required",
        },
        { status: 400 }
      );
    }

    // Report comment using service
    await reportCommentService(commentId, session.user.id, reason);

    // Send email notification (external integration - keep in route)
    try {
      const { default: connectDb } = await import("@/app/api/db/connectDb");
      await connectDb();

      const comment = await Comment.findById(commentId).populate({
        path: "articleId",
        select: "languages.content.mainTitle",
      });

      if (comment && !comment.isDeleted) {
        const article = comment.articleId as {
          languages?: Array<{ content?: { mainTitle?: string } }>;
        };
        const articleTitle =
          article?.languages?.[0]?.content?.mainTitle || "Unknown Article";

        const commentAuthor = await User.findById(comment.userId).select(
          "email username preferences.language"
        );

        if (commentAuthor) {
          const authorLanguage = commentAuthor.preferences?.language || "en";

          await sendCommentReportEmailAction(
            commentAuthor.email,
            commentAuthor.username,
            comment.comment,
            reason,
            articleTitle,
            authorLanguage
          );
        }
      }
    } catch (emailError) {
      console.error("Failed to send comment report email:", emailError);
      // Don't fail the entire operation if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment reported successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Report comment failed!", error as string);
  }
};
