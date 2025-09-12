import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";
import { getUserById } from "@/app/actions/user/getUserById";
import { updateUser } from "@/app/actions/user/updateUser";
import { deleteUser } from "@/app/actions/user/deleteUser";

// @desc    Get user by userId
// @route   GET /users/[userId]
// @access  Public
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await context.params;
    
    const result = await getUserById(userId);

    if (!result.success) {
      const status = result.message === "User not found" ? 404 : 400;
      return new NextResponse(
        JSON.stringify({ message: result.message || result.error }),
        { status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Get user by userId failed!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// @desc    Update user
// @route   PATCH /users/[userId]
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
          message: "You must be signed in to update a user",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    // Parse FORM DATA
    const formData = await req.formData();

    // Extract fields from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const birthDate = formData.get("birthDate") as string;
    const imageFile = formData.get("imageFile") as File;

    // Preferences
    const language = formData.get("language") as string;
    const region = formData.get("region") as string;

    // Use the updateUser action
    const result = await updateUser(
      userId,
      {
        username,
        email,
        role,
        birthDate,
        language,
        region,
        imageFile,
      },
      session.user.id
    );

    if (!result.success) {
      const status = result.message?.includes("not authorized") ? 403 : 
                    result.message?.includes("already taken") ? 409 : 400;
      return new NextResponse(
        JSON.stringify({ message: result.message || result.error }),
        { status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: result.message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Update user failed!",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// @desc    Deactivate user
// @route   DELETE /users/[userId]
// @access  Private
export const DELETE = async (
  req: Request,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    // validate session
    const session = await auth();

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to deactivate a user",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    // Use the deleteUser action
    const result = await deleteUser(userId, session.user.id);

    if (!result.success) {
      const status = result.message?.includes("not authorized") ? 403 : 
                    result.message?.includes("not found") ? 404 : 400;
      return new NextResponse(
        JSON.stringify({ message: result.message || result.error }),
        { status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: result.message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Deactivate user failed!",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
