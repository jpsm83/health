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
    // Log full error details for debugging
    console.error("Error fetching articles by category:", {
      error,
      category: params.category,
      locale: params.locale,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    
    // Return empty serializable response instead of throwing
    // This prevents Next.js 15 serialization errors
    return {
      page: params.page || 1,
      limit: params.limit || 9,
      totalDocs: 0,
      totalPages: 0,
      data: [],
    };
  }
}
