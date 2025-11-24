"use server";

import { ICreateUserParams, ICreateUserResponse } from "@/types/user";

export async function createUser(
  params: ICreateUserParams
): Promise<ICreateUserResponse> {
  try {
    // For file uploads, we need to use FormData
    // Since internalFetch doesn't support FormData directly,
    // we'll need to handle this differently
    // For now, we'll call the route which already handles formData
    const formData = new FormData();
    formData.append("username", params.username);
    formData.append("email", params.email);
    formData.append("password", params.password);
    formData.append("role", params.role);
    formData.append("birthDate", params.birthDate);
    formData.append("language", params.language);
    formData.append("region", params.region);
    if (params.imageFile) {
      formData.append("imageFile", params.imageFile);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "http://localhost:3000");

    const response = await fetch(`${baseUrl}/api/v1/users`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to create user",
      };
    }

    return {
      success: true,
      message: result.message || "User created successfully",
    };
  } catch (error) {
    console.error("Create user failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Create user failed!",
    };
  }
}