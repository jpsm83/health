import axios from "axios";

// Interface for Axios error response data
interface AxiosErrorResponseData {
  message?: string;
}

// Helper method to handle errors
export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message: string =
      (error.response?.data as AxiosErrorResponseData)?.message ||
      "An unexpected error occurred. Please try again.";
    throw new Error(message); // Throw the error with the backend message
  }
  throw new Error("An unexpected error occurred. Please try again."); // Fallback for non-Axios errors
};
