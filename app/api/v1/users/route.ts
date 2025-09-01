import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import passwordValidation from "@/lib/utils/passwordValidation";
import { sendEmailConfirmation } from "@/services/emailService";

// imported models
import User from "@/app/api/models/user";

// imported interfaces
import { IUser, IUserPreferences } from "@/interfaces/user";

// imported constants
import { roles, mainCategories, newsletterFrequencies } from "@/lib/constants";

// @desc    Get all users
// @route   GET /users
// @access  Public
export const GET = async () => {
  try {
    // connect before first call to DB
    await connectDb();

    const users = await User.find().select("-password").lean();

    return !users?.length
      ? new NextResponse(JSON.stringify({ message: "No users found!" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        })
      : new NextResponse(JSON.stringify(users), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
  } catch (error) {
    return handleApiError("Get all users failed!", error as string);
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

    // Subscription Preferences - use default categories if not provided
    const subscriptionPreferencesRaw = formData.get(
      "subscriptionPreferences"
    ) as string;

    // Default subscription preferences with all categories from constants
    const defaultSubscriptionPreferences = {
      categories: mainCategories,
      subscriptionFrequencies: newsletterFrequencies[1], // 'weekly' (index 1)
    };

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !birthDate ||
      !language ||
      !region
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Username, email, password, role, birthDate, language and region are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse subscription preferences from formData or use defaults
    let subscriptionPreferences: {
      categories: string[];
      subscriptionFrequencies: string;
    };
    if (subscriptionPreferencesRaw) {
      try {
        subscriptionPreferences = JSON.parse(
          subscriptionPreferencesRaw
            .replace(/,\s*]/g, "]")
            .replace(/\s+/g, " ")
            .trim()
        );
      } catch {
        // If parsing fails, use defaults
        subscriptionPreferences = defaultSubscriptionPreferences;
      }
    } else {
      // If no subscription preferences provided, use defaults
      subscriptionPreferences = defaultSubscriptionPreferences;
    }

    // Validate password
    if (!passwordValidation(password)) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate subscription preferences
    if (subscriptionPreferences) {
      // Validate subscriptionFrequencies enum
      if (
        !subscriptionPreferences.subscriptionFrequencies ||
        !newsletterFrequencies.includes(
          subscriptionPreferences.subscriptionFrequencies
        )
      ) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid subscription frequency: ${
              subscriptionPreferences.subscriptionFrequencies
            }. Must be one of: ${newsletterFrequencies.join(", ")}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate categories array
      if (
        !subscriptionPreferences.categories ||
        !Array.isArray(subscriptionPreferences.categories)
      ) {
        return new NextResponse(
          JSON.stringify({
            message: "Categories must be an array",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Validate each category
      for (const category of subscriptionPreferences.categories) {
        if (!mainCategories.includes(category)) {
          return new NextResponse(
            JSON.stringify({
              message: `Invalid category: ${category}. Must be one of: ${mainCategories.join(
                ", "
              )}`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Validate roles
    if (!roles.includes(role)) {
      return new NextResponse(JSON.stringify({ message: "Invalid role" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create preferences object
    const preferences: IUserPreferences = {
      language,
      region,
    };

    // connect before first call to DB
    await connectDb();

    // check for duplicates username and email
    const duplicateUser = await User.findOne({
      email,
    });

    if (duplicateUser) {
      return new NextResponse(
        JSON.stringify({
          message: "User with email already exists!",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password asynchronously
    const hashedPassword = await hash(password, 10);

    const userId = new mongoose.Types.ObjectId();

    // Generate verification token for email confirmation
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser: IUser = {
      _id: userId,
      username,
      email,
      password: hashedPassword,
      role,
      birthDate: new Date(birthDate),
      preferences,
      subscriptionPreferences,
      lastLogin: new Date(), // Set to current date automatically
      verificationToken,
      emailVerified: false,
    };

    // upload image to cloudinary
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const folder = `/users/${userId}`;

      const cloudinaryUploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: [imageFile], // only one image
        onlyImages: true,
      });

      if (
        typeof cloudinaryUploadResponse === "string" ||
        cloudinaryUploadResponse.length === 0 ||
        !cloudinaryUploadResponse.every((str) => str.includes("https://")) ||
        !isValidUrl(cloudinaryUploadResponse[0])
      ) {
        return new NextResponse(
          JSON.stringify({
            message: `Error uploading image: ${cloudinaryUploadResponse}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      newUser.imageUrl = cloudinaryUploadResponse[0];
      newUser.imageFile = imageFile.name;
    }

    await User.create(newUser);

    // Send email confirmation
    try {
      const confirmLink = `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/confirm-email?token=${verificationToken}`;

      await sendEmailConfirmation(
        email,
        username,
        confirmLink,
        preferences.language
      );
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail user creation if email fails, just log the error
    }

    return new NextResponse(
      JSON.stringify({
        message: `New user created successfully. Please check your email to confirm your account.`,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return handleApiError(
      "Create user failed!",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
