"use server";

import { internalFetch } from "@/app/actions/utils/internalFetch";

interface WeeklyStats {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export async function getWeeklyStats(): Promise<WeeklyStats> {
  try {
    const result = await internalFetch<{
      success: boolean;
      data: WeeklyStats;
      message: string;
    }>("/api/v1/articles/stats");

    return result.data || {
      totalArticles: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
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
