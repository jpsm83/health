'use server';

import { internalFetch } from "@/app/actions/utils/internalFetch";

export interface SendNewsletterResult {
  success: boolean;
  message: string;
  error?: string;
  sentCount?: number;
}

export default async function sendNewsletterAction(): Promise<SendNewsletterResult> {
  try {
    const result = await internalFetch<{
      success: boolean;
      message: string;
      error?: string;
      sentCount?: number;
    }>("/api/v1/newsletter/send-newsletter", {
      method: "POST",
    });

    return result;
  } catch (error) {
    console.error("Send newsletter error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong while sending newsletter.",
      error: "NEWSLETTER_SEND_FAILED"
    };
  }
}
