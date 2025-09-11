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
import requestEmailConfirmationAction from "@/app/actions/email/requestEmailConfirmation";

// imported models
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";

// imported interfaces
import { IUser, IUserPreferences } from "@/interfaces/user";

// Helper function to generate verification token
function generateToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// imported constants
import { roles, mainCategories } from "@/lib/constants";

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

    // Note: Subscription preferences are now handled via the subscription reference
    // No need to parse subscription preferences from form data

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

    // Start database transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check if user was previously a newsletter subscriber
      const existingSubscriber = await Subscriber.findOne({
        email: email.toLowerCase(),
      }).session(session);

      if (existingSubscriber) {
        console.log("********************************************existingSubscriber", existingSubscriber);

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
        console.log("********************************************no existingSubscriber");

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
      console.log("********************************************newUser", newUser);

      // Create user
      await User.create([newUser], { session });
      
      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return new NextResponse(
        JSON.stringify({
          message: "Failed to create user and subscription",
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } finally {
      await session.endSession();
    }

    // Verify the user was created with the correct subscriptionId
    const createdUser = await User.findById(userId).populate("subscriptionId");
    console.log(
      `Verification - Created user subscriptionId: ${createdUser?.subscriptionId}`
    );
    console.log(
      `Verification - Created user subscriptionId type: ${typeof createdUser?.subscriptionId}`
    );

    // Send email confirmation
    try {
      await requestEmailConfirmationAction(email);
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
