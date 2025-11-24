"use server";

import {
  IUpdateSubscriberPreferencesParams,
  IUpdateSubscriberPreferencesResponse,
} from "@/types/subscriber";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function updateSubscriberPreferences(
  subscriberId: string,
  params: IUpdateSubscriberPreferencesParams,
  sessionUserId: string
): Promise<IUpdateSubscriberPreferencesResponse> {
  try {
    const { subscriptionPreferences } = params;

    const result = await internalFetch<{
      success: boolean;
      message: string;
      data?: unknown;
    }>(`/api/v1/subscribers/${subscriberId}`, {
      method: "PATCH",
      body: { subscriptionPreferences },
      headers: {
        // Note: sessionUserId is validated in the route via auth()
        // This is just for reference - the route will get the session itself
      },
    });

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Update subscriber preferences failed!",
      };
    }

    return {
      success: true,
      message: result.message || "Subscriber preferences updated successfully",
      data: result.data as IUpdateSubscriberPreferencesResponse["data"],
    };
  } catch (error) {
    console.error("Update subscriber preferences failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Update subscriber preferences failed!";
    
    // Check for specific error types
    if (errorMessage.includes("Invalid subscriber ID format")) {
      return {
        success: false,
        message: "Invalid subscriber ID format",
      };
    }
    
    if (errorMessage.includes("not found")) {
      return {
        success: false,
        message: "Subscriber not found",
      };
    }
    
    if (errorMessage.includes("not authorized")) {
      return {
        success: false,
        message: "You are not authorized to update this subscriber!",
      };
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
