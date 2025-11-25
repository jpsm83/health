import { v2 as cloudinary } from "cloudinary";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import mongoose from "mongoose";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

export interface UploadImageParams {
  imageFile: File;
  folderId: string;
}

export interface UploadImageResult {
  imageUrl: string;
  publicId: string;
  folder: string;
}

export async function uploadImageService(
  params: UploadImageParams
): Promise<UploadImageResult> {
  const { imageFile, folderId } = params;

  // Validate required fields
  if (!imageFile || !folderId) {
    throw new Error("Image file and folderId are required!");
  }

  // Validate image file
  if (!(imageFile instanceof File) || !imageFile.type.startsWith("image/")) {
    throw new Error("Only image files are allowed!");
  }

  // Validate file size (optional - 10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > maxSize) {
    throw new Error("Image file size must be less than 10MB!");
  }

  // Validate folderId format (should be a valid ObjectId or string)
  if (typeof folderId !== "string" || folderId.trim().length === 0) {
    throw new Error("Invalid folderId format!");
  }

  // Convert file to data URI
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const dataUri = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

  // Upload preset
  const uploadPreset = "health";
  
  // Create folder path using the provided ID
  const folderPath = `/${folderId}`;

  // Upload to Cloudinary
  const response = await cloudinary.uploader.upload(dataUri, {
    invalidate: true,
    upload_preset: uploadPreset,
    folder: `${uploadPreset}${folderPath}`,
    resource_type: "auto",
  });

  // Connect to database and update article with new image URL
  try {
    await connectDb();
    
    // Check if article exists
    if (mongoose.Types.ObjectId.isValid(folderId)) {
      const article = await Article.findById(folderId);
      if (article) {
        // Update the article's articleImages array with the new image URL
        await Article.findByIdAndUpdate(
          folderId,
          { $addToSet: { articleImages: response.secure_url } },
          { new: true }
        );
      } else {
        console.warn(`Article with ID ${folderId} not found, but image uploaded successfully`);
      }
    }
  } catch (dbError) {
    console.error("Failed to update article with image URL:", dbError);
    // Don't fail the entire request if database update fails
    // The image was successfully uploaded to Cloudinary
  }

  return {
    imageUrl: response.secure_url,
    publicId: response.public_id,
    folder: folderPath,
  };
}

export async function checkArticlePermissionService(
  articleId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return false;
  }

  await connectDb();

  const article = await Article.findById(articleId).select("createdBy");

  if (!article) {
    return false;
  }

  const isAuthor = article.createdBy.toString() === userId;
  const isAdmin = userRole === "admin";

  return isAuthor || isAdmin;
}

