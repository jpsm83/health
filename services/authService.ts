// services/authService.ts
import axios, { type AxiosInstance } from "axios";
import { handleAxiosError } from "@/lib/utils/handleAxiosError";

const API_BASE = "/api/v1";

// Axios-based API service
// Only for backend API calls (user registration, password reset, etc.)
// Does NOT handle login/logout (NextAuth does that through useAuth hook)

class AuthService {
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

  // Register a new user
  async registerUser(userData: {
    username: string;
    email: string;
    password: string;
    birthDate: string;
    imageFile?: File;
  }) {
    const browserLanguage = navigator.language || "en";
    const browserRegion = navigator.language.split("-")[1] || "US";

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", "user");
    formData.append("birthDate", userData.birthDate);
    formData.append("language", browserLanguage);
    formData.append("region", browserRegion);
    formData.append("contentLanguage", browserLanguage);

    if (userData.imageFile) {
      formData.append("imageFile", userData.imageFile);
    }

    return this.handleRequest(() => this.instance.post("/users", formData));
  }

  // Request password reset email
  async requestPasswordReset(email: string) {
    return this.handleRequest(() =>
      this.instance.post("/auth/forgot-password", { email })
    );
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string) {
    return this.handleRequest(() =>
      this.instance.post("/auth/reset-password", { token, newPassword })
    );
  }
}

// Export singleton instance for API calls
export const authService = new AuthService();
