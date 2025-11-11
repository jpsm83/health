"use server";

import { hash } from "bcrypt";
import mongoose from "mongoose";
import crypto from "crypto";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import passwordValidation from "@/lib/utils/passwordValidation";
import requestEmailConfirmation from "@/app/actions/auth/requestEmailConfirmation";

// imported models
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";

// imported interfaces
import { IUser, IUserPreferences } from "@/types/user";
import { ICreateUserParams, ICreateUserResponse } from "@/types/user";

// imported constants
import { roles, mainCategories } from "@/lib/constants";

// Helper function to generate verification token
function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function createUser(params: ICreateUserParams): Promise<ICreateUserResponse> {
  try {
    const {
      username,
      email,
      password,
      role,
      birthDate,
      language,
      region,
      imageFile,
    } = params;

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
      return {
        success: false,
        message: "Username, email, password, role, birthDate, language and region are required!",
      };
    }

    // Validate password
    if (!passwordValidation(password)) {
      return {
        success: false,
        message: "Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!",
      };
    }

    // Validate roles
    if (!roles.includes(role)) {
      return {
        success: false,
        message: "Invalid role",
      };
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
      return {
        success: false,
        message: "User with email already exists!",
      };
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
        return {
          success: false,
          message: `Error uploading image: ${cloudinaryUploadResponse}`,
        };
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
      return {
        success: false,
        message: "Failed to create user and subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      };
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

    return {
      success: true,
      message: "New user created successfully. Please check your email to confirm your account.",
    };
  } catch (error) {
    console.error("Create user failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Create user failed!",
    };
  }
}
