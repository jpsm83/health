"use server";

import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";

interface WeeklyStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  try {
    await connectDb();

    // Get total articles count
    const totalArticles = await Article.countDocuments({});

    // Get ALL articles to calculate total stats
    const allArticles = await Article.find({}).select('views likes commentsCount');

    // Calculate total stats
    const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = allArticles.reduce((sum, article) => sum + (article.likes?.length || 0), 0);
    const totalComments = allArticles.reduce((sum, article) => sum + (article.commentsCount || 0), 0);

    return {
      totalArticles,
      totalViews,
      totalLikes,
      totalComments,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalArticles: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
    };
  }
}
