"use server";

import { ISerializedUser, IUserResponse } from "@/types/user";
import { internalFetch } from "@/app/actions/utils/internalFetch";

export async function getUsers(): Promise<IUserResponse> {
  try {
    const users = await internalFetch<ISerializedUser[]>("/api/v1/users");

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "No users found!",
      };
    }

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Get all users failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Get all users failed!",
    };
  }
}
