"use server";

import connectDb from "@/app/api/db/connectDb";
import isObjectIdValid from "@/app/api/utils/isObjectIdValid";
import User from "@/app/api/models/user";
import Article from "@/app/api/models/article";
import { ISerializedArticle } from "@/interfaces/article";
import { serializeMongoObject } from "@/interfaces/article";

export interface IGetUserLikedArticlesResponse {
  success: boolean;
  data?: ISerializedArticle[];
  totalDocs?: number;
  totalPages?: number;
  currentPage?: number;
  message?: string;
  error?: string;
}

export async function getUserLikedArticles(
  userId: string,
  page: number = 1,
  limit: number = 6,
  locale: string = "en"
): Promise<IGetUserLikedArticlesResponse> {
  try {
    // Validate ObjectId
    if (!isObjectIdValid([userId])) {
      return {
        success: false,
        message: "Invalid user ID format!",
      };
    }

    // Connect to database
    await connectDb();

    // Find the user and populate liked articles
    const user = await User.findById(userId).select("likedArticles");
    
    if (!user) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    if (!user.likedArticles || user.likedArticles.length === 0) {
      return {
        success: true,
        data: [],
        totalDocs: 0,
        totalPages: 0,
        currentPage: page,
        message: "No liked articles found!",
      };
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
      "contentsByLanguage.seo.hreflang": locale,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize the articles
    const serializedArticles = articles.map((article) =>
      serializeMongoObject(article)
    ) as ISerializedArticle[];

    return {
      success: true,
      data: serializedArticles,
      totalDocs,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Get user liked articles failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get user liked articles failed!",
    };
  }
}
