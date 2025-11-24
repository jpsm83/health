"use server";

import { IReportCommentParams } from "@/types/comment";
import { internalFetch } from "@/app/actions/utils/internalFetch";

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

    const result = await internalFetch<{
      success: boolean;
      message?: string;
    }>(`/api/v1/comments/${commentId}/reports`, {
      method: "POST",
      body: {
        reason,
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.message || "Failed to report comment",
      };
    }

    return {
      success: true,
      message: result.message || "Comment reported successfully",
    };
  } catch (error) {
    console.error("Error in reportComment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to report comment",
    };
  }
};
