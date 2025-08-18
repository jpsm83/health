import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import mongoose from "mongoose";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";

// imported models
import User from "@/app/api/models/user";

// imported interfaces
import { IUser, ICategoryInterest, IUserPreferences } from "@/interfaces/user";

// imported constants
import { roles } from "@/lib/constants";

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
    const contentLanguage = formData.get("contentLanguage") as string;

    // Category Interests (parse as JSON)
    const categoryInterestsRaw = formData.get("categoryInterests") as string;

    // Validate required fields
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !birthDate ||
      !language ||
      !region ||
      !contentLanguage ||
      !categoryInterestsRaw
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Username, email, password, role, birthDate, language, region, contentLanguage, and categoryInterestsRaw are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse categoryInterests from formData
    const categoryInterests = JSON.parse(
      categoryInterestsRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
    ) as ICategoryInterest[];

    const categoryInterestsRequiredFields = [
      "type",
      "newsletterSubscription",
      "subscriptionFrequencies",
    ];

    // Validate category interests
    if (categoryInterests && categoryInterests.length > 0) {
      for (const interest of categoryInterests) {
        const validationResult = objDefaultValidation(
          interest as unknown as {
            [key: string]: string | number | boolean | undefined;
          },
          {
            reqFields: categoryInterestsRequiredFields,
            nonReqFields: [],
          }
        );

        if (validationResult !== true) {
          return new NextResponse(
            JSON.stringify({
              message: validationResult,
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
      contentLanguage,
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

    const newUser: IUser = {
      _id: userId,
      username,
      email,
      password: hashedPassword,
      role,
      birthDate: new Date(birthDate),
      preferences,
      categoryInterests,
      lastLogin: new Date(),
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

    return new NextResponse(
      JSON.stringify({
        message: `New user created successfully`,
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
