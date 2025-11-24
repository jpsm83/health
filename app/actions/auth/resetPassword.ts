'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface ResetPasswordResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: { token, newPassword },
    });

    return result;
  } catch (error) {
    console.error('Reset password action failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Password reset failed",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
