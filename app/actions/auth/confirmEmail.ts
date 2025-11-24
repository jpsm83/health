'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface ConfirmEmailResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function confirmEmailAction(
  token: string
): Promise<ConfirmEmailResult> {
  try {
    // Validate token
    if (!token || token.trim() === '') {
      return {
        success: false,
        message: "Verification token is required",
        error: "Missing token"
      };
    }

    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/auth/confirm-email", {
      method: "POST",
      body: { token },
    });

    return result;
  } catch (error) {
    console.error('Confirm email action failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Email confirmation failed",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
