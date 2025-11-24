"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface NewsletterConfirmResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function confirmNewsletterSubscriptionAction(
  token: string,
  email: string
): Promise<NewsletterConfirmResult> {
  try {
    if (!token || !email) {
      return {
        success: false,
        message: "Token and email are required!",
        error: "MISSING_PARAMETERS",
      };
    }

    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/subscribers/confirm-newsletter-subscription", {
      method: "POST",
      body: { token, email },
    });

    return result;
  } catch (error) {
    console.error("Newsletter confirmation error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      error: "CONFIRMATION_FAILED",
    };
  }
}
