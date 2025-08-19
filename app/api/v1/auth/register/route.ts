import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import mongoose from "mongoose";
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import User from "@/app/api/models/user";
import { IUser, IUserPreferences } from "@/interfaces/user";

// @desc    Register new user
// @route   POST /auth/register
// @access  Public
export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, email, password, birthDate, categoryInterests } = body;

    // Validate required fields
    if (!username || !email || !password || !birthDate) {
      return new NextResponse(
        JSON.stringify({
          message: "Username, email, password, and birthDate are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return new NextResponse(
        JSON.stringify({
          message: "Password must be at least 6 characters long!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to database
    await connectDb();

    // Check for duplicate email
    const duplicateUser = await User.findOne({ email });
    if (duplicateUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User with this email already exists!",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check for duplicate username
    const duplicateUsername = await User.findOne({ username });
    if (duplicateUsername) {
      return new NextResponse(
        JSON.stringify({
          message: "Username already taken!",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user preferences with defaults
    const userPreferences: IUserPreferences = {
      language: "en",
      region: "US",
      contentLanguage: "en",
    };

    // Create new user
    const newUser: IUser = {
      _id: new mongoose.Types.ObjectId(),
      username,
      email,
      password: hashedPassword,
      role: "user", // Default role
      birthDate: new Date(birthDate),
      preferences: userPreferences,
      categoryInterests: categoryInterests || [],
      lastLogin: new Date(),
      isActive: true,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await User.create(newUser);

    return new NextResponse(
      JSON.stringify({
        message: "User registered successfully!",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "User registration failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
