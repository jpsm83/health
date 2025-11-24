'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface NewsletterUnsubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function unsubscribeFromNewsletterAction(
  email: string,
  token?: string
): Promise<NewsletterUnsubscribeResult> {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required!",
        error: "MISSING_EMAIL"
      };
    }

    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/subscribers", {
      method: "DELETE",
      body: { email, token },
    });

    return result;
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      error: "UNSUBSCRIBE_FAILED"
    };
  }
}
