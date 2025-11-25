'use server';

// Note: This action calls the API route because the route handles
// email sending after the service generates the reset token.

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "http://localhost:3000");

export interface RequestPasswordResetResult {
  success: boolean;
  message: string;
  resetLink?: string;
  error?: string;
}

export default async function requestPasswordResetAction(
  email: string
): Promise<RequestPasswordResetResult> {
  try {
    const response = await fetch(`${baseUrl}/api/v1/auth/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to process password reset request",
        error: result.error || "Unknown error",
      };
    }

    return result;
  } catch (error) {
    console.error('Request password reset action failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process password reset request",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
