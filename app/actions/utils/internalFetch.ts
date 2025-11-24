// Helper function for server actions to make internal API calls
// This allows actions to be thin bridges that call API routes
// Using axios instead of fetch to avoid stream transform issues

import axios from 'axios';
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
  
  try {
    const response = await axios({
      method: method.toLowerCase(),
      url,
      data: body,
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }), // Forward cookies for authentication
        ...headers,
      },
      validateStatus: () => true, // Don't throw on any status, we'll handle it manually
    });
    
    if (response.status >= 400) {
      const errorData = typeof response.data === 'string' 
        ? { message: response.data } 
        : response.data;
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText || 'Request failed'}`
      );
    }
    
    // Handle empty responses
    if (!response.data) {
      return {} as T;
    }
    
    // Axios automatically parses JSON, but we handle both cases
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle axios-specific errors
      if (error.response) {
        const errorData = typeof error.response.data === 'string'
          ? { message: error.response.data }
          : error.response.data;
        throw new Error(
          errorData?.message || `HTTP ${error.response.status}: ${error.message}`
        );
      }
      throw new Error(error.message || "Internal fetch failed");
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Internal fetch failed");
  }
}

