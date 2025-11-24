import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import { handleApiError } from "@/app/api/utils/handleApiError";
import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import User from "@/app/api/models/user";
import { commentReportReasons } from "@/lib/constants";
import sendCommentReportEmailAction from "@/app/actions/user/commentReport";
import { Types } from "mongoose";

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

    // Validate reason
    if (!commentReportReasons.includes(reason)) {
      return NextResponse.json(
        { success: false, message: "Invalid report reason" },
        { status: 400 }
      );
    }

    await connectDb();

    // Find the comment with article info
    const comment = await Comment.findById(commentId).populate({
      path: "articleId",
      select: "languages.content.mainTitle",
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found!" },
        { status: 404 }
      );
    }

    if (comment.isDeleted) {
      return NextResponse.json(
        { success: false, message: "Cannot report a deleted comment!" },
        { status: 400 }
      );
    }

    // Get article title
    const article = comment.articleId as {
      languages?: Array<{ content?: { mainTitle?: string } }>;
    };
    const articleTitle =
      article?.languages?.[0]?.content?.mainTitle || "Unknown Article";

    // Check if user already reported this comment
    const alreadyReported = comment.reports?.some(
      (report: { userId: { toString: () => string } }) =>
        report.userId.toString() === session.user.id
    );

    if (alreadyReported) {
      return NextResponse.json(
        { success: false, message: "You have already reported this comment!" },
        { status: 400 }
      );
    }

    // Get the comment author's information
    const commentAuthor = await User.findById(comment.userId).select(
      "email username preferences.language"
    );

    if (!commentAuthor) {
      return NextResponse.json(
        { success: false, message: "Comment author not found!" },
        { status: 404 }
      );
    }

    // Add report to comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          reports: {
            userId: new Types.ObjectId(session.user.id),
            reason: reason,
            reportedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json(
        { success: false, message: "Failed to report comment!" },
        { status: 500 }
      );
    }

    // Send email notification to the comment author
    try {
      const authorLanguage = commentAuthor.preferences?.language || "en";

      await sendCommentReportEmailAction(
        commentAuthor.email,
        commentAuthor.username,
        comment.comment,
        reason,
        articleTitle,
        authorLanguage
      );
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
