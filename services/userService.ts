import { IUser, ISubscriptionPreferences } from "@/interfaces/user";
import axios, { type AxiosInstance } from "axios";
import { handleAxiosError } from "@/lib/utils/handleAxiosError";

export interface IUpdateProfileData {
  username?: string;
  email?: string;
  role?: string;
  birthDate?: string;
  subscriptionPreferences?: ISubscriptionPreferences;
  imageFile?: File;
  currentPassword?: string;
  newPassword?: string;
}

// Generic API response interface for all services
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_BASE = "/api/v1";

class UserService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE,
      withCredentials: true, // ensures cookies are sent
    });
  }

  // Generic request wrapper with centralized error handling
  private async handleRequest<T>(
    requestFn: () => Promise<{ data: T }>
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  async updateUserProfile(
    userId: string | { toString(): string },
    profileData: IUpdateProfileData
  ): Promise<IApiResponse<IUser>> {
    try {
      const formData = new FormData();

      // Add required fields that the backend expects
      if (profileData.username) formData.append("username", profileData.username);
      if (profileData.email) formData.append("email", profileData.email);
      if (profileData.role) formData.append("role", profileData.role);
      if (profileData.birthDate)
        formData.append("birthDate", profileData.birthDate);

      // Add subscription preferences
      if (profileData.subscriptionPreferences) {
        formData.append(
          "subscriptionPreferences",
          JSON.stringify(profileData.subscriptionPreferences)
        );
      }

      // Add image file if provided
      if (profileData.imageFile) {
        formData.append("imageFile", profileData.imageFile);
      }

      // Add required preference fields that the backend expects
      // These are required by the backend validation
      formData.append("language", "en"); // Default language
      formData.append("region", "US"); // Default region
      formData.append("contentLanguage", "en"); // Default content language

      const result = await this.handleRequest<IUser>(() => 
        this.instance.patch(`/users/${userId.toString()}`, formData)
      );

      return {
        success: true,
        data: result,
        message: "User profile updated successfully",
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update user profile",
      };
    }
  };
}

// Export singleton instance for API calls
export const userService = new UserService();
