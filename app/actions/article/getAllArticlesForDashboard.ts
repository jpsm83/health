"use server";

import { ISerializedArticle, serializeMongoObject } from "@/interfaces/article";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

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
