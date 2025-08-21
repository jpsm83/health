"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

export const useAuth = () => {
  const { data: session, status, update } = useSession();

  // Register new user through users endpoint, then sign in with NextAuth
  const signUpCredentials = useCallback(
    async (userData: {
      username: string;
      email: string;
      password: string;
      birthDate: string;
    }) => {
      try {
        // Get browser language and region automatically
        const browserLanguage = navigator.language || "en";
        const browserRegion = navigator.language.split("-")[1] || "US";

        // First, create the user through the users endpoint
        const formData = new FormData();
        formData.append("username", userData.username);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        formData.append("role", "user"); // Default role for new users
        formData.append("birthDate", userData.birthDate);
        formData.append("language", browserLanguage);
        formData.append("region", browserRegion);
        formData.append("contentLanguage", browserLanguage);

        const response = await fetch("/api/v1/users", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          return {
            success: false,
            error: errorData.message || "Registration failed",
          };
        }

        // After successful registration, automatically sign in the user with NextAuth
        const loginResult = await signIn("credentials", {
          email: userData.email,
          password: userData.password,
          redirect: false,
        });

        if (loginResult?.ok) {
          await update(); // Update session
          return { success: true };
        } else {
          return {
            success: false,
            error: "Registration successful but automatic login failed",
          };
        }
      } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Registration failed" };
      }
    },
    [update]
  );

  // Register with Google OAuth (creates account and signs in)
  const signUpGoogle = useCallback(async () => {
    try {
      // Get browser language and region
      const browserLanguage = navigator.language || "en";
      const browserRegion = navigator.language.split("-")[1] || "US";

      // For Google OAuth signup, we need to redirect to Google's OAuth flow
      // Pass browser info through the state parameter
      // signIn() is NOT just for login - it's for ALL authentication:
      // signIn('google') = Start Google OAuth flow (signup OR login)
      await signIn("google", {
        callbackUrl: "/",
        redirect: true, // Must be true for OAuth flows
        state: JSON.stringify({
          browserLanguage,
          browserRegion,
          timestamp: Date.now(),
        }),
      });
      // Note: This will redirect the user, so we return success immediately
      return { success: true };
    } catch (error) {
      console.error("Google registration error:", error);
      return { success: false, error: "Google registration failed" };
    }
  }, []);

  // Login with credentials or Google OAuth
  const login = useCallback(
    async (
      provider: "google" | "credentials",
      credentials?: { email: string; password: string }
    ) => {
      try {
        if (provider === "credentials" && credentials) {
          const result = await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          if (result?.ok) {
            await update(); // Update session
            return { success: true };
          }
        } else if (provider === "google") {
          // For Google OAuth, we need to redirect to Google's OAuth flow
          // This will handle both signup and signin automatically
          await signIn("google", {
            callbackUrl: "/", // Redirect to dashboard after successful auth
            redirect: true, // Must be true for OAuth flows
          });
          // Note: This will redirect the user, so we return success immediately
          return { success: true };
        }
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Authentication failed",
        };
      }
    },
    [update]
  );

  // Sign out using NextAuth directly
  const logout = useCallback(async () => {
    try {
      // Clear the session using NextAuth (handles both client and server)
      await signOut({
        redirect: false,
      });

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Logout failed" };
    }
  }, []);

  // Get current session info
  const getSession = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/auth/session", {
        credentials: "include",
      });

      if (response.ok) {
        const sessionData = await response.json();
        return { success: true, session: sessionData };
      } else {
        return { success: false, error: "Failed to get session" };
      }
    } catch (error) {
      console.error("Get session error:", error);
      return { success: false, error: "Failed to get session" };
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

    // Get user info from session
  const getUser = useCallback((): {
    id: string;
    email: string;
    name: string;
    role: string;
    imageUrl: string | null;
  } | null => {
    if (session?.user) {
      return {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || '',
        imageUrl: session.user.imageUrl || null,
      };
    }
    return null;
  }, [session]);

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string) => {
      return session?.user?.role === role;
    },
    [session]
  );

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole("admin");
  }, [hasRole]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      await update();
      return { success: true };
    } catch (error) {
      console.error("Session refresh error:", error);
      return { success: false, error: "Failed to refresh session" };
    }
  }, [update]);

  // Forgot password - send reset email
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message,
          resetLink: data.resetLink, // Only available in development
        };
      } else {
        return {
          success: false,
          error: data.message || "Failed to send reset email",
        };
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, error: "Failed to send reset email" };
    }
  }, []);

  // Reset password with token
  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        const response = await fetch("/api/v1/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          return { success: true, message: data.message };
        } else {
          return {
            success: false,
            error: data.message || "Failed to reset password",
          };
        }
      } catch (error) {
        console.error("Reset password error:", error);
        return { success: false, error: "Failed to reset password" };
      }
    },
    []
  );

  return {
    // Session state
    user: getUser(),
    isAuthenticated,
    isLoading,
    session,

    // Authentication methods
    signUpCredentials,
    signUpGoogle,
    login,
    logout,

    // Password management
    forgotPassword,
    resetPassword,

    // Session management
    getSession,
    refreshSession,
    update,

    // Role checking
    hasRole,
    isAdmin,

    // Utility methods
    status,
  };
};
