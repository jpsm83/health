import { NextResponse } from "next/server";
import { handleApiError } from "@/app/api/utils/handleApiError";
import { auth } from "@/app/api/v1/auth/[...nextauth]/auth";
import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import Article from "@/app/api/models/article";
import { ISerializedArticle, serializeMongoObject } from "@/types/article";

// @desc    Get user's liked articles
// @route   GET /api/v1/users/[userId]/liked-articles
// @access  Private (User can only access their own liked articles)
export const GET = async (
  req: Request,
  context: { params: Promise<{ userId: string }> }
) => {
  try {
    // Validate session
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({
          message: "You must be signed in to view liked articles",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = await context.params;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({
          message: "User ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user is trying to access their own liked articles
    if (session.user.id !== userId) {
      return new NextResponse(
        JSON.stringify({
          message: "You can only access your own liked articles",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return NextResponse.json(
        { message: "Invalid user ID format!" },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const locale = searchParams.get("locale") || "en";

    // Connect to database
    await connectDb();

    // Find the user and populate liked articles
    const user = await User.findById(userId).select("likedArticles");

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    if (!user.likedArticles || user.likedArticles.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: [],
          totalDocs: 0,
          totalPages: 0,
          currentPage: page,
          message: "No liked articles found!",
        },
        { status: 200 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalDocs = user.likedArticles.length;
    const totalPages = Math.ceil(totalDocs / limit);

    // Get the paginated liked article IDs
    const paginatedLikedArticleIds = user.likedArticles.slice(skip, skip + limit);

    // Find articles that match the liked article IDs
    const articles = await Article.find({
      _id: { $in: paginatedLikedArticleIds },
      "languages.hreflang": locale,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize the articles
    const serializedArticles = articles.map((article) =>
      serializeMongoObject(article)
    ) as ISerializedArticle[];

    return NextResponse.json(
      {
        success: true,
        data: serializedArticles,
        totalDocs,
        totalPages,
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError("Get user liked articles failed!", error as string);
  }
};
