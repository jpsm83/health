'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";


export interface RequestPasswordResetResult {
  success: boolean;
  message: string;
  resetLink?: string;
  error?: string;
}

export default async function requestPasswordResetAction(
  email: string
): Promise<RequestPasswordResetResult> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
      resetLink?: string;
      error?: string;
    }>("/api/v1/auth/request-password-reset", {
      method: "POST",
      body: { email },
    });

    return result;
  } catch (error) {
    console.error('Request password reset action failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process password reset request",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
