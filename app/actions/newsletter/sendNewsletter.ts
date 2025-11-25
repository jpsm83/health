'use server';

// Note: This action calls the API route because the route handles
// the email sending orchestration. The service layer only provides
// the subscriber data. Email sending is handled at the route level.

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000");

export interface SendNewsletterResult {
  success: boolean;
  message: string;
  error?: string;
  sentCount?: number;
}

export default async function sendNewsletterAction(): Promise<SendNewsletterResult> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/newsletter/send-newsletter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to send newsletter",
        error: result.error || "NEWSLETTER_SEND_FAILED",
      };
    }

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
