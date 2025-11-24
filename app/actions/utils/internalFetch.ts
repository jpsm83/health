// Helper function for server actions to make internal API calls
// This allows actions to be thin bridges that call API routes

import { cookies } from "next/headers";

const getBaseUrl = (): string => {
  // In production, use the public base URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // In development, use localhost
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  
  // Fallback
  return "http://localhost:3000";
};

export interface InternalFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export async function internalFetch<T = unknown>(
  path: string,
  options: InternalFetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  
  // Get cookies from the request context to forward authentication
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  
  const fetchOptions: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies for authentication
      ...headers,
    },
  };
  
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text || "Unknown error" };
      }
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as T;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Internal fetch failed");
  }
}

