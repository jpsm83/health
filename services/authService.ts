const API_BASE = "/api/v1";

// Register a new user with credentials
export async function registerUser(userData: {
  username: string;
  email: string;
  password: string;
  birthDate: string;
  imageFile?: File;
}) {
  try {
    // Get browser language and region automatically
    const browserLanguage = navigator.language || "en";
    const browserRegion = navigator.language.split("-")[1] || "US";

    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", "user"); // Default role for new users
    formData.append("birthDate", userData.birthDate);
    formData.append("language", browserLanguage);
    formData.append("region", browserRegion);
    formData.append("contentLanguage", browserLanguage);

    // Add image file if provided
    if (userData.imageFile) {
      formData.append("imageFile", userData.imageFile);
    }

    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Sign in with credentials (handles the backend auth flow)
export async function signInWithCredentials() {
  try {
    // This would typically call your backend auth endpoint
    // For now, we'll return success since NextAuth handles the actual authentication
    // But this gives us a place to add backend auth logic if needed later
    return { success: true };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
}

// Sign in with Google OAuth (handles the OAuth flow setup)
export async function signInWithGoogle(callbackUrl: string = "/") {
  try {
    // Get browser language and region for OAuth state
    const browserLanguage = navigator.language || "en";
    const browserRegion = navigator.language.split("-")[1] || "US";

    // Return the OAuth configuration
    return {
      success: true,
      oauthConfig: {
        callbackUrl,
        state: JSON.stringify({
          browserLanguage,
          browserRegion,
          timestamp: Date.now(),
        }),
      },
    };
  } catch (error) {
    console.error("Google OAuth setup error:", error);
    throw error;
  }
}

// Sign out (handles backend cleanup if needed)
export async function signOut() {
  try {
    // This would typically call your backend logout endpoint
    // For now, we'll return success since NextAuth handles the actual logout
    // But this gives us a place to add backend logout logic if needed later
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

// Request password reset email
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset email");
    }

    return {
      success: true,
      message: data.message,
      resetLink: data.resetLink, // Only available in development
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
}

// Reset password with token
export async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password");
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
}
