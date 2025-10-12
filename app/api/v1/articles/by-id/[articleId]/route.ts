import { NextResponse } from "next/server";
import { auth } from "../../../auth/[...nextauth]/route";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { deleteArticle } from "@/app/actions/article/deleteArticle";
import { updateArticle } from "@/app/actions/article/updateArticle";
import { checkAuthWithApiKey } from "@/lib/utils/apiKeyAuth";
import User from "@/app/api/models/user";
import { ILanguageSpecific } from "@/types/article";

// Interface for update parameters
interface UpdateArticleParams {
  articleId: string;
  category?: string;
  languages?: ILanguageSpecific[];
  imagesContext?: {
    imageOne: string;
    imageTwo: string;
    imageThree: string;
    imageFour: string;
  };
  articleImages?: File[];
  articleVideo?: string;
  userId: string;
  isAdmin: boolean;
}

// @desc    Update article by ID
// @route   PATCH /api/v1/articles/by-id/[articleId]
// @access  Private (Author or Admin only, Session or API Key)
export const PATCH = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    // Validate session or API key
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    const { articleId } = await context.params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse FORM DATA instead of JSON because we might have image files
    const formData = await req.formData();

    // Extract article fields
    const category = formData.get("category") as string;
    const languagesRaw = formData.get("languages") as string;
    const imagesContextRaw = formData.get("imagesContext") as string;
    const articleVideo = formData.get("articleVideo") as string;
    const fileEntries = formData
      .getAll("articleImages")
      .filter((entry): entry is File => entry instanceof File);

    // Prepare update parameters
    const updateParams: UpdateArticleParams = {
      articleId,
      userId: "",
      isAdmin: false,
      articleVideo,
    };

    // Determine user ID and admin status
    if (session) {
      updateParams.userId = session.user.id;
      updateParams.isAdmin = session.user.role === "admin";
    } else {
      // For API key authentication, find an admin user
      const adminUser = await User.findOne({ role: "admin" }).select("_id").lean() as { _id: string } | null;
      if (!adminUser || !adminUser._id) {
        return new NextResponse(
          JSON.stringify({
            message: "No admin user found for API key authentication",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      updateParams.userId = adminUser._id.toString();
      updateParams.isAdmin = true; // API key users are treated as admin
    }

    // Add optional fields if provided
    if (category) {
      updateParams.category = category;
    }

    if (languagesRaw) {
      try {
        const languages = JSON.parse(
          languagesRaw.replace(/,\s*]/g, "]").replace(/\s+/g, " ").trim()
        );
        updateParams.languages = languages;
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid languages format: ${error}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (imagesContextRaw) {
      try {
        const imagesContext = JSON.parse(
          imagesContextRaw.replace(/,\s*}/g, "}").replace(/\s+/g, " ").trim()
        );
        updateParams.imagesContext = imagesContext;
      } catch (error) {
        return new NextResponse(
          JSON.stringify({
            message: `Invalid imagesContext format: ${error}`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (fileEntries.length > 0) {
      updateParams.articleImages = fileEntries;
    }

    // Call the update article action
    const result = await updateArticle(updateParams);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to update article",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 
                 result.message?.includes("not authorized") ? 403 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message || "Article updated successfully",
        article: result.article,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Update article failed!", error as string);
  }
};

// @desc    Delete article by ID
// @route   DELETE /api/v1/articles/by-id/[articleId]
// @access  Private (Author or Admin only, Session or API Key)
export const DELETE = async (
  req: Request,
  context: { params: Promise<{ articleId: string }> }
) => {
  try {
    // Validate session or API key
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    const { articleId } = await context.params;

    if (!articleId) {
      return new NextResponse(
        JSON.stringify({
          message: "Article ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Determine user ID and admin status
    let userId: string;
    let isAdmin: boolean;

    if (session) {
      userId = session.user.id;
      isAdmin = session.user.role === "admin";
    } else {
      // For API key authentication, find an admin user
      const adminUser = await User.findOne({ role: "admin" }).select("_id").lean() as { _id: string } | null;
      if (!adminUser || !adminUser._id) {
        return new NextResponse(
          JSON.stringify({
            message: "No admin user found for API key authentication",
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
      userId = adminUser._id.toString();
      isAdmin = true; // API key users are treated as admin
    }

    // Call the delete article action
    const result = await deleteArticle(articleId, userId, isAdmin);

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          message: result.message || "Failed to delete article",
        }),
        { 
          status: result.message?.includes("not found") ? 404 : 
                 result.message?.includes("not authorized") ? 403 : 400,
          headers: { "Content-Type": "application/json" } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: result.message || "Article deleted successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return handleApiError("Delete article failed!", error as string);
  }
};