'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";


export interface RequestEmailConfirmationResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function requestEmailConfirmation(
  email: string
): Promise<RequestEmailConfirmationResult> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/auth/request-email-confirmation", {
      method: "POST",
      body: { email },
    });

    return result;
  } catch (error) {
    console.error('Request email confirmation action failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process email confirmation request",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
