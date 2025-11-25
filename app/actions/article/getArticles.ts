"use server";

import { IGetArticlesParams, ISerializedArticle } from "@/types/article";
import { IPaginatedResponse } from "@/types/api";
import {
  getArticlesService,
  GetArticlesServiceParams,
} from "@/lib/services/articles";

export async function getArticles(
  params: IGetArticlesParams & { skipCount?: boolean; fields?: string } = {}
): Promise<IPaginatedResponse<ISerializedArticle>> {
  try {
    const serviceParams: GetArticlesServiceParams = {
      ...params,
    };

    return await getArticlesService(serviceParams);
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw new Error(
      `Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
