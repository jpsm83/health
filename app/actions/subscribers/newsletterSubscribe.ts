'use server';

// Note: This action calls the API route because the route handles
// email sending after the service creates/updates the subscriber.
// The service handles DB operations, but email sending is orchestrated at the route level.

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000");

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
    const response = await fetch(`${baseUrl}/api/v1/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, preferences }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to subscribe to newsletter",
        error: result.error || "SUBSCRIPTION_FAILED",
      };
    }

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
