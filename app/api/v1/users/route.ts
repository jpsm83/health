import { createUser } from "@/app/actions/user/createUser";
import { getUsers } from "@/app/actions/user/getUsers";
import { NextResponse } from "next/server";

// @desc    Get all users
// @route   GET /users
// @access  Public
export const GET = async () => {
  try {
    const result = await getUsers();

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ message: result.message || result.error }),
        {
          status: result.message === "No users found!" ? 404 : 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(JSON.stringify(result.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Get all users failed!" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

// @desc    Create new user
// @route   POST /users
// @access  Public
export const POST = async (req: Request) => {
  try {
    // Parse FORM DATA instead of JSON because we might have an image file
    const formData = await req.formData();

    // Extract fields from formData
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const birthDate = formData.get("birthDate") as string;
    const imageFile = formData.get("imageFile") as File | undefined;

    // Preferences
    const language = formData.get("language") as string;
    const region = formData.get("region") as string;

    // Use the createUser action
    const result = await createUser({
      username,
      email,
      password,
      role,
      birthDate,
      language,
      region,
      imageFile,
    });

    if (!result.success) {
      const status = result.message?.includes("already exists") ? 409 : 400;
      return new NextResponse(
        JSON.stringify({ message: result.message || result.error }),
        { status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: result.message }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ 
        message: "Create user failed!",
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
