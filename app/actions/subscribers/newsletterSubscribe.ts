'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";


export interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
  error?: string;
}

export default async function subscribeToNewsletterAction(
  email: string,
  preferences: {
    categories?: string[];
    subscriptionFrequencies?: string;
  } = {}
): Promise<NewsletterSubscribeResult> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
    }>("/api/v1/subscribers", {
      method: "POST",
      body: { email, preferences },
    });

    return result;
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      error: "SUBSCRIPTION_FAILED"
    };
  }
}
