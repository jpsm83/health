"use server";

import { IDeleteCommentParams } from "@/types/comment";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export const deleteComment = async (params: IDeleteCommentParams): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { commentId, userId } = params;

    if (!userId) {
      throw new Error("You must be signed in to delete comments");
    }

    if (!commentId) {
      throw new Error("Comment ID is required");
    }

    const result = await internalFetch<{
      success: boolean;
      message?: string;
    }>(`/api/v1/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!result.success) {
      return {
        success: false,
        error: result.message || "Failed to delete comment",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteComment:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
};
