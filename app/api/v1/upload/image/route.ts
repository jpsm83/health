import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary ENV variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

// @desc    Upload single image to Cloudinary
// @route   POST /upload/image
// @access  Private
export const POST = async (req: Request) => {
  // Validate session
  const session = await auth();
  if (!session) {
    return new NextResponse(
      JSON.stringify({
        message: "You must be signed in to upload an image",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Parse form data
    const formData = await req.formData();
    
    // Extract image file and folder ID
    const imageFile = formData.get("image") as File;
    const folderId = formData.get("folderId") as string;

    // Validate required fields
    if (!imageFile || !folderId) {
      return new NextResponse(
        JSON.stringify({
          message: "Image file and folderId are required!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate image file
    if (!(imageFile instanceof File) || !imageFile.type.startsWith("image/")) {
      return new NextResponse(
        JSON.stringify({
          message: "Only image files are allowed!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate file size (optional - 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > maxSize) {
      return new NextResponse(
        JSON.stringify({
          message: "Image file size must be less than 10MB!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate folderId format (should be a valid ObjectId or string)
    if (typeof folderId !== "string" || folderId.trim().length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid folderId format!",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
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

    // Return success response with image URL
    return new NextResponse(
      JSON.stringify({
        message: "Image uploaded successfully!",
        imageUrl: response.secure_url,
        publicId: response.public_id,
        folder: folderPath,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Image upload error:", error);
    return new NextResponse(
      JSON.stringify({
        message: `Image upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
