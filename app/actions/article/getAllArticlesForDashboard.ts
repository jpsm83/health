"use server";

import { ISerializedArticle, serializeMongoObject } from "@/types/article";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import User from "@/app/api/models/user"; // Import User model to ensure it's registered
// Ensure User model is registered for populate operations
void User;

export async function getAllArticlesForDashboard(): Promise<ISerializedArticle[]> {
  try {
    await connectDb();

    // Get all articles with populated createdBy field
    const articles = await Article.find({})
      .populate({ path: "createdBy", select: "username" })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize MongoDB objects to plain objects for client components
    const serializedArticles = articles.map((article): ISerializedArticle => {
      return serializeMongoObject(article) as ISerializedArticle;
    });

    return serializedArticles;
  } catch (error) {
    console.error("Error fetching articles for dashboard:", error);
    return [];
  }
}
