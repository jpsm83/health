"use server";

import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user";
import { commentReportReasons } from "@/lib/constants";
import sendCommentReportEmailAction from "@/app/actions/user/commentReport";
import { Types } from "mongoose";

export const reportComment = async (
  articleId: string,
  commentId: string,
  userId: string,
  reason: string
) => {
  try {
    if (!userId || !articleId || !commentId || !reason) {
      throw new Error(
        "User id, article id, comment id, and reason are required!"
      );
    }

    // Validate reason
    if (!commentReportReasons.includes(reason)) {
      throw new Error("Invalid report reason");
    }

    await connectDb();

    // Check if article and comment exist, and get the comment author info
    const articleComment = await Article.findOne({
      _id: articleId,
      "comments._id": commentId,
    }).select("comments.$ contentsByLanguage.mainTitle");

    if (!articleComment) {
      throw new Error("Article comment not found!");
    }

    const comment = articleComment.comments[0];
    const articleTitle =
      articleComment.contentsByLanguage[0]?.mainTitle || "Unknown Article";

    // Check if user already reported this comment
    const alreadyReported = comment.commentReports?.some(
      (report: { userId: string }) => report.userId.toString() === userId
    );

    if (alreadyReported) {
      throw new Error("User already reported this comment!");
    }

    // Get the comment author's information
    const commentAuthor = await User.findById(comment.userId).select(
      "email username preferences.language"
    );

    if (!commentAuthor) {
      throw new Error("Comment author not found!");
    }

    // Add report to comment
    const updatedArticle = await Article.findOneAndUpdate(
      {
        _id: new Types.ObjectId(articleId),
        "comments._id": new Types.ObjectId(commentId),
      },
      {
        $push: {
          "comments.$.commentReports": {
            userId: new Types.ObjectId(userId),
            reason: reason,
            reportedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedArticle) {
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
      error:
        error instanceof Error ? error.message : "Failed to report comment",
    };
  }
};
