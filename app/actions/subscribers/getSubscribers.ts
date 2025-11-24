"use server";

import { IGetSubscribersResponse } from "@/types/subscriber";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getSubscribers(): Promise<IGetSubscribersResponse> {
  try {
    const result = await internalFetch<{
      success: boolean;
      count: number;
      data: unknown[];
      message?: string;
    }>("/api/v1/subscribers");

    if (!result.success) {
      return {
        success: false,
        message: result.message || "No subscribers found!",
      };
    }

    return {
      success: true,
      data: result.data as IGetSubscribersResponse["data"],
    };
  } catch (error) {
    console.error("Get subscribers failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get subscribers failed!",
    };
  }
}
