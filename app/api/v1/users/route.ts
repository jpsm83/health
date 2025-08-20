import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import mongoose from "mongoose";

// imported utils
import connectDb from "@/app/api/db/connectDb";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { isValidUrl } from "@/lib/utils/isValidUrl";
import objDefaultValidation from "@/lib/utils/objDefaultValidation";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import passwordValidation from "@/lib/utils/passwordValidation";

// imported models
import User from "@/app/api/models/user";

// imported interfaces
import { IUser, ICategoryInterest, IUserPreferences } from "@/interfaces/user";

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
    const contentLanguage = formData.get("contentLanguage") as string;

    // Category Interests - use default categories if not provided
    const categoryInterestsRaw = formData.get("categoryInterests") as string;
    
    // Default category interests with all categories from constants
    const defaultCategoryInterests = mainCategories.map(category => ({
      type: category,
      newsletterSubscription: false,
      subscriptionFrequencies: newsletterFrequencies[1] // 'weekly' (index 1)
    }));

    // Validate required fields (categoryInterests is no longer required since we have defaults)
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      !birthDate ||
      !language ||
      !region ||
      !contentLanguage
    ) {
      return new NextResponse(
        JSON.stringify({
          message:
            "Username, email, password, role, birthDate, language, region, and contentLanguage are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse categoryInterests from formData or use defaults
    let categoryInterests: ICategoryInterest[];
    if (categoryInterestsRaw) {
      try {
        categoryInterests = JSON.parse(
          categoryInterestsRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
        ) as ICategoryInterest[];
      } catch {
        // If parsing fails, use defaults
        categoryInterests = defaultCategoryInterests;
      }
    } else {
      // If no categoryInterests provided, use defaults
      categoryInterests = defaultCategoryInterests;
    }

    // Validate password
    if (!passwordValidation(password)) {
      return new NextResponse(JSON.stringify({ message: "Password must be at least 6 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol!" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const categoryInterestsRequiredFields = [
      "type",
      "newsletterSubscription",
      "subscriptionFrequencies",
    ];

    // Validate category interests
    if (categoryInterests && categoryInterests.length > 0) {
      for (const interest of categoryInterests) {
        // Validate required fields
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

        // Validate subscriptionFrequencies enum
        if (!interest.subscriptionFrequencies || !newsletterFrequencies.includes(interest.subscriptionFrequencies)) {
          return new NextResponse(
            JSON.stringify({
              message: `Invalid subscription frequency: ${interest.subscriptionFrequencies}. Must be one of: ${newsletterFrequencies.join(', ')}`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Validate type enum
        if (!interest.type || !mainCategories.includes(interest.type)) {
          return new NextResponse(
            JSON.stringify({
              message: `Invalid category type: ${interest.type}. Must be one of: ${mainCategories.join(', ')}`,
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
      lastLogin: new Date(), // Set to current date automatically
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
