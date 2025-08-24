"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
import { 
  registerUser, 
  signInWithCredentials, 
  signInWithGoogle, 
  signOut as authSignOut,
  requestPasswordReset, 
  resetPassword 
} from "@/services/authService";

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
        // Use authService for user registration
        await registerUser(userData);

        // After successful registration, automatically sign in the user with NextAuth
        const loginResult = await signIn("credentials", {
          email: userData.email,
          password: userData.password,
          redirect: false,
        });

        if (loginResult?.ok) {
          try {
            await update(); // Update session
            return { success: true };
          } catch (error) {
            console.error("Session update failed:", error);
            // Even if session update fails, login was successful
            return { success: true };
          }
        } else {
          return {
            success: false,
            error: "Registration successful but automatic login failed",
          };
        }
      } catch (error) {
        console.error("Registration error:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Registration failed" 
        };
      }
    },
    [update]
  );

  // Register with Google OAuth (creates account and signs in)
  const signUpGoogle = useCallback(async () => {
    try {
      // Use authService for OAuth setup
      const oauthResult = await signInWithGoogle("/");
      
      if (oauthResult.success) {
        // Use NextAuth to handle the actual OAuth flow
        await signIn("google", {
          callbackUrl: oauthResult.oauthConfig.callbackUrl,
          redirect: true, // Must be true for OAuth flows
          state: oauthResult.oauthConfig.state,
        });
        // Note: This will redirect the user, so we return success immediately
        return { success: true };
      } else {
        return { success: false, error: "Failed to setup Google OAuth" };
      }
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
          try {
            // Use authService for backend auth preparation
            await signInWithCredentials();
          } catch (error) {
            // Handle backend auth preparation failure gracefully
            console.error("Backend auth preparation failed:", error);
            return { 
              success: false, 
              error: "Authentication service unavailable" 
            };
          }
          
          // Use NextAuth for actual authentication
          const result = await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
          });

          if (result?.error) {
            // Handle login failure gracefully without throwing errors
            return { 
              success: false, 
              error: "Invalid email or password" 
            };
          }

          if (result?.ok) {
            try {
              await update(); // Update session
              return { success: true };
            } catch (error) {
              console.error("Session update failed:", error);
              // Even if session update fails, login was successful
              return { success: true };
            }
          }

          // Fallback for unexpected results
          return { 
            success: false, 
            error: "Authentication failed" 
          };
        } else if (provider === "google") {
          try {
            // Use authService for OAuth setup
            const oauthResult = await signInWithGoogle("/");
            
            if (oauthResult.success) {
              // Use NextAuth to handle the actual OAuth flow
              await signIn("google", {
                callbackUrl: oauthResult.oauthConfig.callbackUrl,
                redirect: true, // Must be true for OAuth flows
                state: oauthResult.oauthConfig.state,
              });
              // Note: This will redirect the user, so we return success immediately
              return { success: true };
            } else {
              return { success: false, error: "Failed to setup Google OAuth" };
            }
          } catch (error) {
            console.error("Google OAuth setup failed:", error);
            return { success: false, error: "Google OAuth setup failed" };
          }
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

  // Sign out using NextAuth and authService
  const logout = useCallback(async () => {
    try {
      // Use authService for backend cleanup if needed
      await authSignOut();
      
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

  // Forgot password - send reset email
  const forgotPassword = useCallback(async (email: string) => {
    try {
      // Use authService for password reset request
      const result = await requestPasswordReset(email);
      return result;
    } catch (error) {
      console.error("Forgot password error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to send reset email" 
      };
    }
  }, []);

  // Reset password with token
  const resetPasswordWithToken = useCallback(
    async (token: string, newPassword: string) => {
      try {
        // Use authService for password reset
        const result = await resetPassword(token, newPassword);
        return result;
      } catch (error) {
        console.error("Reset password error:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to reset password" 
        };
      }
    },
    []
  );

  return {
    // Session state (direct from NextAuth)
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",

    // Authentication methods
    signUpCredentials,
    signUpGoogle,
    login,
    logout,

    // Password management
    forgotPassword,
    resetPassword: resetPasswordWithToken,

    // Session update (from NextAuth)
    update,
  };
};
