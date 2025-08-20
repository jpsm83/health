import { NextResponse } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";
import { hash, compare } from "bcrypt";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";

// imported models
import User from "@/app/api/models/user";

// @desc    Change user password (logged in user)
// @route   PATCH /api/v1/users/[userId]/password
// @access  Private
export const PATCH = async (
  req: Request,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    // validate session
    const session = await auth();

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to change your password",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid user ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is trying to change their own password
    if (session.user.id !== userId) {
      return new NextResponse(
        JSON.stringify({
          message: "You can only change your own password",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse JSON body for password change
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return new NextResponse(
        JSON.stringify({
          message: "Current password and new password are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // current must be different from new password
    if (currentPassword === newPassword) {
      return new NextResponse(
        JSON.stringify({ message: "Current password and new password cannot be the same" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return new NextResponse(
        JSON.stringify({
          message: "New password must be at least 6 characters long",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // connect before first call to DB
    await connectDb();

    // Get user with password for verification
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return new NextResponse(
        JSON.stringify({
          message: "Current password is incorrect",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash new password
    const hashedNewPassword = await hash(newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(userId, {
      $set: { password: hashedNewPassword },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Password changed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Password change failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
