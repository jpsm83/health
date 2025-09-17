"use server";

import connectDb from "@/app/api/db/connectDb";
import Comment from "@/app/api/models/comment";
import User from "@/app/api/models/user";
import { IReportCommentParams } from "@/types/comment";
import { commentReportReasons } from "@/lib/constants";
import sendCommentReportEmailAction from "@/app/actions/user/commentReport";
import { Types } from "mongoose";

export const reportComment = async (params: IReportCommentParams): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    const { commentId, userId, reason } = params;

    if (!userId || !commentId || !reason) {
      throw new Error("User id, comment id, and reason are required!");
    }

    // Validate reason
    if (!commentReportReasons.includes(reason)) {
      throw new Error("Invalid report reason");
    }

    await connectDb();

    // Find the comment with article info
    const comment = await Comment.findById(commentId).populate({
      path: "articleId",
      select: "contentsByLanguage.mainTitle",
    });

    if (!comment) {
      throw new Error("Comment not found!");
    }

    if (comment.isDeleted) {
      throw new Error("Cannot report a deleted comment!");
    }

    // Get article title
    const article = comment.articleId as { contentsByLanguage?: Array<{ mainTitle?: string }> };
    const articleTitle = article?.contentsByLanguage?.[0]?.mainTitle || "Unknown Article";

    // Check if user already reported this comment
    const alreadyReported = comment.reports?.some(
      (report: { userId: { toString: () => string } }) => report.userId.toString() === userId
    );

    if (alreadyReported) {
      throw new Error("You have already reported this comment!");
    }

    // Get the comment author's information
    const commentAuthor = await User.findById(comment.userId).select(
      "email username preferences.language"
    );

    if (!commentAuthor) {
      throw new Error("Comment author not found!");
    }

    // Add report to comment
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          reports: {
            userId: new Types.ObjectId(userId),
            reason: reason,
            reportedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Failed to report comment!");
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

    return {
      success: true,
      message: "Comment reported successfully",
    };
  } catch (error) {
    console.error("Error in reportComment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to report comment",
    };
  }
};
