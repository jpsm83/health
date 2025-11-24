"use server";

import { ISerializedArticle } from "@/types/article";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getAllArticlesForDashboard(): Promise<ISerializedArticle[]> {
  try {
    const result = await internalFetch<{
      success: boolean;
      data: ISerializedArticle[];
      count: number;
      message: string;
    }>("/api/v1/articles/dashboard");

    return result.data || [];
  } catch (error) {
    console.error("Error fetching articles for dashboard:", error);
    return [];
  }
}
