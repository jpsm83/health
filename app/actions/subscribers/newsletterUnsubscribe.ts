'use server';

// Note: This action calls the API route because the route handles
// the unsubscribe flow. The service handles DB operations, but the route
// orchestrates the response messages based on whether user has account.

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000");

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

    const response = await fetch(`${baseUrl}/api/v1/subscribers`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, token }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to unsubscribe from newsletter",
        error: result.error || "UNSUBSCRIBE_FAILED",
      };
    }

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
