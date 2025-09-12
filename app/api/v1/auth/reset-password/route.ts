import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import resetPasswordAction from "@/app/actions/auth/resetPassword";

// @desc    Reset password with token (forgot password flow)
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const POST = async (req: NextRequest) => {
  try {
    const { token, newPassword } = await req.json();

    // Validate required fields
    if (!token || !newPassword) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Reset token and new password are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the action to handle password reset
    const result = await resetPasswordAction(token, newPassword);

    if (!result.success) {
      const statusCode = result.error === "Missing required fields" || 
                        result.error === "Password too short" || 
                        result.error === "Invalid or expired token" ? 400 : 500;
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: result.message,
          error: result.error,
        }),
        { status: statusCode, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: result.message,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Password reset failed!", error as string);
  }
};
