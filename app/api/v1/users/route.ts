import { NextResponse } from "next/server";
import connectDb from "@/app/api/db/connectDb";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import { ISerializedUser } from "@/types/user";
import { hash } from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import passwordValidation from "@/lib/utils/passwordValidation";
import requestEmailConfirmation from "@/app/actions/auth/requestEmailConfirmation";
import { IUser, IUserPreferences } from "@/types/user";
import { roles, mainCategories } from "@/lib/constants";

// Helper function to generate verification token
function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Helper function to serialize MongoDB user object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeUser(user: unknown): ISerializedUser {
  const u = user as {
    _id?: { toString: () => string };
    username: string;
    email: string;
    role: string;
    birthDate?: Date;
    imageFile?: string;
    imageUrl?: string;
    preferences?: unknown;
    subscriptionId?: { toString: () => string };
    likedArticles?: unknown[];
    commentedArticles?: unknown[];
    lastLogin?: Date;
    isActive?: boolean;
    emailVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };

  return {
    _id: u._id?.toString() || "",
    username: u.username,
    email: u.email,
    role: u.role,
    birthDate: u.birthDate?.toISOString() || new Date().toISOString(),
    imageFile: u.imageFile,
    imageUrl: u.imageUrl,
    preferences: u.preferences as ISerializedUser["preferences"],
    subscriptionId: u.subscriptionId?.toString() || null,
    subscriptionPreferences: {
      categories: [],
      subscriptionFrequencies: "weekly",
    },
    likedArticles:
      u.likedArticles?.map((id: unknown) => {
        if (id && typeof id === "object" && "toString" in id) {
          return id.toString();
        }
        return String(id);
      }) || [],
    commentedArticles:
      u.commentedArticles?.map((id: unknown) => {
        if (id && typeof id === "object" && "toString" in id) {
          return id.toString();
        }
        return String(id);
      }) || [],
    lastLogin: u.lastLogin?.toISOString(),
    isActive: u.isActive,
    emailVerified: u.emailVerified,
    createdAt: u.createdAt?.toISOString(),
    updatedAt: u.updatedAt?.toISOString(),
  };
}

// @desc    Get all users
// @route   GET /users
// @access  Public
export const GET = async () => {
  try {
    await connectDb();

    // Fetch all users excluding password
    const users = await User.find().select("-password").lean();

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "No users found!" },
        { status: 404 }
      );
    }

    // Serialize users for client components
    const serializedUsers = users.map(serializeUser);

    return NextResponse.json(serializedUsers, { status: 200 });
  } catch (error) {
    console.error("Get all users failed:", error);
    return NextResponse.json(
      {
        message: "Get all users failed!",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
      return NextResponse.json(
        {
          message:
            "Username, email, password, role, birthDate, language and region are required!",
        },
        { status: 400 }
      );
    }

    // Validate password
    if (!passwordValidation(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!",
        },
        { status: 400 }
      );
    }

    // Validate roles
    if (!roles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    // Create preferences object
    const preferences: IUserPreferences = {
      language,
      region,
    };

    // Connect to database
    await connectDb();

    // Check for duplicate email
    const duplicateUser = await User.findOne({
      email,
    });

    if (duplicateUser) {
      return NextResponse.json(
        { message: "User with email already exists!" },
        { status: 409 }
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
      lastLogin: new Date(), // Set to current date automatically
      verificationToken,
      emailVerified: false,
    };

    // Upload image to cloudinary if provided
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
        return NextResponse.json(
          {
            message: `Error uploading image: ${cloudinaryUploadResponse}`,
          },
          { status: 400 }
        );
      }

      newUser.imageUrl = cloudinaryUploadResponse[0];
      newUser.imageFile = imageFile.name;
    }

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if user was previously a newsletter subscriber
      const existingSubscriber = await Subscriber.findOne({
        email: email.toLowerCase(),
      }).session(session);

      if (existingSubscriber) {
        // Link existing subscription to new user
        await Subscriber.findOneAndUpdate(
          { email: email.toLowerCase() },
          {
            $set: {
              userId: newUser._id,
            },
          },
          {
            new: true,
            session: session,
          }
        );
        // Use existing subscriber's ID
        newUser.subscriptionId = existingSubscriber._id;
      } else {
        // Create new subscription for user
        const subscriptionId = new mongoose.Types.ObjectId();

        await Subscriber.create(
          [
            {
              _id: subscriptionId,
              email: email.toLowerCase(),
              userId: newUser._id,
              emailVerified: false,
              verificationToken: generateToken(),
              unsubscribeToken: generateToken(),
              subscriptionPreferences: {
                categories: mainCategories,
                subscriptionFrequencies: "weekly",
              },
            },
          ],
          { session }
        );
        // Use new subscription's ID
        newUser.subscriptionId = subscriptionId;
      }

      // Create user
      await User.create([newUser], { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return NextResponse.json(
        {
          message: "Failed to create user and subscription",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }

    // Verify the user was created with the correct subscriptionId
    await User.findById(userId).populate("subscriptionId");

    // Send email confirmation
    try {
      await requestEmailConfirmation(email);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail user creation if email fails, just log the error
    }

    return NextResponse.json(
      {
        message:
          "New user created successfully. Please check your email to confirm your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        message: "Create user failed!",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};
