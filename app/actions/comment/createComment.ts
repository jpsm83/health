"use server";

import { ICreateCommentParams, ISerializedComment } from "@/types/comment";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export const createComment = async (params: ICreateCommentParams): Promise<{
  success: boolean;
  comment?: ISerializedComment;
  error?: string;
}> => {
  try {
    const { articleId, userId, comment } = params;

    // Validation
    if (!userId) {
      throw new Error("You must be signed in to comment");
    }

    if (!articleId) {
      throw new Error("Article ID is required");
    }

    const result = await internalFetch<{
      success: boolean;
      data: ISerializedComment;
      message?: string;
    }>("/api/v1/comments", {
      method: "POST",
      body: {
        articleId,
        comment,
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.message || "Failed to create comment",
      };
    }

    return {
      success: true,
      comment: result.data,
    };
  } catch (error) {
    console.error("Create comment failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create comment",
    };
  }
};
