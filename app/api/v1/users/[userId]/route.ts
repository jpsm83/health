import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import Subscriber from "@/app/api/models/subscriber";
import { ISerializedUser } from "@/types/user";
import uploadFilesCloudinary from "@/lib/cloudinary/uploadFilesCloudinary";
import deleteFilesCloudinary from "@/lib/cloudinary/deleteFilesCloudinary";
import { IUser, IUserPreferences } from "@/types/user";
import { roles } from "@/lib/constants";

// Helper function to serialize MongoDB user object with subscription preferences
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeUser(user: unknown, subscriptionPreferences?: unknown): ISerializedUser {
  // Helper function to ensure plain object conversion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toPlainObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== "object") return obj;
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(toPlainObject);

    // Convert to plain object to remove any MongoDB-specific methods
    return JSON.parse(JSON.stringify(obj));
  };

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

  const subPrefs = subscriptionPreferences as {
    categories?: unknown[];
    subscriptionFrequencies?: string;
  } | null;

  return {
    _id: u._id?.toString() || "",
    username: u.username,
    email: u.email,
    role: u.role,
    birthDate: u.birthDate?.toISOString() || new Date().toISOString(),
    imageFile: u.imageFile,
    imageUrl: u.imageUrl,
    preferences: (toPlainObject(u.preferences) as ISerializedUser["preferences"]) || {
      language: "en",
      region: "US",
    },
    subscriptionId: u.subscriptionId?.toString() || null,
    subscriptionPreferences: subPrefs
      ? {
          categories: Array.isArray(subPrefs.categories)
            ? subPrefs.categories.map((cat: unknown) => String(cat))
            : [],
          subscriptionFrequencies: String(subPrefs.subscriptionFrequencies || "weekly"),
        }
      : {
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

// @desc    Get user by userId
// @route   GET /users/[userId]
// @access  Public
export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get subscription preferences if user has a subscription
    let subscriptionPreferences = null;
    if (user && !Array.isArray(user) && (user as { subscriptionId?: unknown }).subscriptionId) {
      const subscriber = await Subscriber.findById(
        (user as { subscriptionId: unknown }).subscriptionId
      )
        .select("subscriptionPreferences")
        .lean();

      if (
        subscriber &&
        !Array.isArray(subscriber) &&
        (subscriber as { subscriptionPreferences?: unknown }).subscriptionPreferences
      ) {
        // Ensure plain object conversion
        subscriptionPreferences = JSON.parse(
          JSON.stringify(
            (subscriber as { subscriptionPreferences: unknown }).subscriptionPreferences
          )
        );
      }
    }

    // Serialize user for client components with subscription preferences
    const serializedUser = serializeUser(user, subscriptionPreferences);

    return NextResponse.json(serializedUser, { status: 200 });
  } catch (error) {
    console.error("Get user by userId failed:", error);
    return NextResponse.json(
      {
        message: "Get user by userId failed!",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
      return NextResponse.json(
        {
          message: "You must be signed in to update a user",
        },
        { status: 401 }
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

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return NextResponse.json(
        { message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (
      !username ||
      !email ||
      !role ||
      !birthDate ||
      !language ||
      !region
    ) {
      return NextResponse.json(
        {
          message:
            "Username, email, role, birthDate, language and region are required!",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the user is the same user (authorization)
    if (user.id !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to update this user!" },
        { status: 403 }
      );
    }

    // Prepare update object
    const updateData: Partial<IUser> = {};

    // Validate and update username
    if (user.username !== username) updateData.username = username;

    // Validate and update email
    if (user.email !== email) {
      const duplicateEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (duplicateEmail) {
        return NextResponse.json(
          { message: "Email is already taken by another user" },
          { status: 409 }
        );
      }
      updateData.email = email;
    }

    // Validate and update role
    if (!roles.includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    if (user.role !== role) updateData.role = role;

    // Update birth date
    const parsedBirthDate = new Date(birthDate);
    if (user.birthDate.toISOString() !== parsedBirthDate.toISOString()) {
      updateData.birthDate = parsedBirthDate;
    }

    // Update preferences
    const preferences: IUserPreferences = {
      language,
      region,
    };
    if (JSON.stringify(user.preferences) !== JSON.stringify(preferences)) {
      updateData.preferences = preferences;
    }

    // Handle image upload if provided
    const isNewImageProvided =
      imageFile &&
      imageFile instanceof File &&
      imageFile.size > 0 &&
      imageFile.name !== user.imageFile;

    const deleteUserImage = async () => {
      if (user.imageFile) {
        const deleteResult: string | boolean = await deleteFilesCloudinary(
          user.imageUrl || ""
        );
        if (deleteResult !== true) {
          return {
            success: false,
            message: deleteResult as string,
          };
        }
      }
      return { success: true };
    };

    if (isNewImageProvided) {
      const folder = `/users/${userId}`;

      const uploadResponse = await uploadFilesCloudinary({
        folder,
        filesArr: [imageFile],
        onlyImages: true,
      });

      const isUploadValid =
        Array.isArray(uploadResponse) &&
        uploadResponse.length > 0 &&
        uploadResponse.every((url) => url.includes("https://"));

      if (!isUploadValid) {
        return NextResponse.json(
          {
            message: `Error uploading image: ${uploadResponse}`,
          },
          { status: 400 }
        );
      }

      const deleteResult = await deleteUserImage();
      if (!deleteResult.success) {
        return NextResponse.json(
          { message: deleteResult.message },
          { status: 400 }
        );
      }

      updateData.imageFile = imageFile.name;
      updateData.imageUrl = uploadResponse[0];
    } else {
      // CASE: No new image provided at all (imageFile is undefined/null/empty)
      const isImageFileMissingOrEmpty =
        !imageFile || !(imageFile instanceof File) || imageFile.size === 0;

      if (isImageFileMissingOrEmpty && user.imageFile) {
        const deleteResult = await deleteUserImage();
        if (!deleteResult.success) {
          return NextResponse.json(
            { message: deleteResult.message },
            { status: 400 }
          );
        }

        await User.updateOne(
          { _id: userId },
          {
            $unset: {
              imageFile: "",
              imageUrl: "",
            },
          }
        );
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        lean: true,
      }
    );

    // Check if updatedUser is undefined
    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Update user failed!",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
      return NextResponse.json(
        {
          message: "You must be signed in to deactivate a user",
        },
        { status: 401 }
      );
    }

    const { userId } = await context.params;

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return NextResponse.json(
        { message: "Invalid user ID format!" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDb();

    // Check if user exists
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // Check if the user is the same user (authorization)
    if (user.id !== session.user.id) {
      return NextResponse.json(
        { message: "You are not authorized to deactivate this user!" },
        { status: 403 }
      );
    }

    // Deactivate user
    await User.findByIdAndUpdate(userId, { $set: { isActive: false } });

    return NextResponse.json(
      { message: "User deactivated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Deactivate user failed!",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
