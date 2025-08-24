import { IUser } from "@/interfaces/user";

export interface UpdateProfileData {
  username?: string;
  email?: string;
  role?: string;
  birthDate?: string;
  categoryInterests?: Array<{
    type: string;
    subscriptionFrequencies?: string;
  }>;
  imageFile?: File;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user?: IUser;
  message?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  user?: IUser;
  message?: string;
}

const baseUrl = "/api/v1/users";

const updateUserProfile = async (
  userId: string | { toString(): string },
  profileData: UpdateProfileData
): Promise<UpdateProfileResponse> => {
  try {
    const formData = new FormData();

    // Add required fields that the backend expects
    if (profileData.username) formData.append("username", profileData.username);
    if (profileData.email) formData.append("email", profileData.email);
    if (profileData.role) formData.append("role", profileData.role);
    if (profileData.birthDate)
      formData.append("birthDate", profileData.birthDate);

    // Add category interests
    if (profileData.categoryInterests) {
      formData.append(
        "categoryInterests",
        JSON.stringify(profileData.categoryInterests)
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

    const response = await fetch(`${baseUrl}/${userId.toString()}`, {
      method: "PATCH", // Changed from PUT to PATCH
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }

    return {
      success: true,
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

export { updateUserProfile };
