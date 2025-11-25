"use server";

import { IGetArticlesParams, ISerializedArticle } from "@/types/article";
import { IPaginatedResponse } from "@/types/api";
import {
  getArticlesService,
  GetArticlesServiceParams,
} from "@/lib/services/articles";
import { FieldProjectionType } from "@/app/api/utils/fieldProjections";

export async function getArticlesByCategory(
  params: IGetArticlesParams & { category: string; skipCount?: boolean; fields?: FieldProjectionType }
): Promise<IPaginatedResponse<ISerializedArticle>> {
  try {
    const serviceParams: GetArticlesServiceParams = {
      ...params,
    };

    return await getArticlesService(serviceParams);
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    throw new Error(
      `Failed to fetch articles by category: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
