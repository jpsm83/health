import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import resetPasswordAction from "@/app/actions/email/resetPassword";

// @desc    Reset password with token (forgot password flow)
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    // Validate required fields
    if (!token || !newPassword) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Reset token and new password are required" 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await resetPasswordAction(token, newPassword);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ 
          message: result.message 
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        message: result.message 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError(
      "Password reset failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
