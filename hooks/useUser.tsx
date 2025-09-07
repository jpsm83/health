import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { userService } from "@/services/userService";
import type { IUpdateProfileData } from "@/services/userService";
import { mainCategories } from "@/lib/constants";
import { IUser } from "@/interfaces/user";

export const useUser = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch user data from database when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setUser(null);
        setIsInitializing(false);
        return;
      }

      try {
        setIsInitializing(true);
        const response = await fetch(`/api/v1/users/${session.user.id}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to fetch user data: ${response.status} ${errorText}`
          );
        }

        const userData = await response.json();
        
        // Fetch subscription data if user has a subscriptionId
        let subscriptionData = null;
        if (userData.subscriptionId) {
          try {
            const subscriptionResponse = await fetch(`/api/v1/subscribers/${userData.subscriptionId}`);
            if (subscriptionResponse.ok) {
              subscriptionData = await subscriptionResponse.json();
            }
          } catch (subscriptionError) {
            console.error("Error fetching subscription data:", subscriptionError);
          }
        }
        
        // Transform the database user data to match our IUser interface
        const transformedUser: IUser = {
          _id: userData._id || session.user.id,
          username: userData.username || session.user.name || "",
          email: userData.email || session.user.email || "",
          password: userData.password || "", // Password is optional in frontend
          role: userData.role || session.user.role || "user",
          birthDate: userData.birthDate
            ? new Date(userData.birthDate)
            : new Date("2000-02-29"),
          imageUrl: userData.imageUrl || session.user.imageUrl || "",
          emailVerified: userData.emailVerified || false,
          preferences: userData.preferences || {
            language: "en",
            region: "US",
          },
          subscriptionId: userData.subscriptionId || null,
          subscriptionPreferences: {
            categories: subscriptionData?.subscriptionPreferences?.categories || mainCategories,
            subscriptionFrequencies: subscriptionData?.subscriptionPreferences?.subscriptionFrequencies || "weekly",
          },
          likedArticles: userData.likedArticles || [],
          commentedArticles: userData.commentedArticles || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        };

        setUser(transformedUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");

        // Fallback to session data if database fetch fails
        if (session?.user) {
          const fallbackUser: IUser = {
            _id: session.user.id,
            username: session.user.name || "",
            email: session.user.email || "",
            password: "", // Password not available in session
            role: session.user.role || "user",
            birthDate: new Date("2000-02-29"),
            imageUrl: session.user.imageUrl || "",
            emailVerified: false,
            preferences: {
              language: "en",
              region: "US",
            },
            subscriptionPreferences: {
              categories: mainCategories,
              subscriptionFrequencies: "weekly",
            },
            likedArticles: [],
            commentedArticles: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setUser(fallbackUser);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    fetchUserData();
  }, [session]);

  const updateProfile = async (profileData: IUpdateProfileData) => {
    if (!session?.user?.id || !session?.user?.email) {
      setError("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      // First try to get the actual MongoDB user ID by email
      let actualUserId = session.user.id;

      // Check if the session ID is a valid MongoDB ObjectId by trying to fetch the user
      let response = await fetch(`/api/v1/users/${session.user.id}`);
      if (!response.ok) {
        // If ID lookup fails, get user by email to find the correct MongoDB ID
        response = await fetch(
          `/api/v1/users/by-email?email=${encodeURIComponent(
            session.user.email
          )}`
        );
        if (response.ok) {
          const userData = await response.json();
          actualUserId = userData._id;
        }
      }

      // Update user data (without subscription preferences)
      const userUpdateData = { ...profileData };
      delete userUpdateData.subscriptionPreferences; // Remove subscription data from user update
      
      const result = await userService.updateUserProfile(
        actualUserId,
        userUpdateData
      );

      if (result.success) {
        // Update subscription preferences separately if provided
        if (profileData.subscriptionPreferences && user?.subscriptionId) {
          try {
            const subscriptionResponse = await fetch(`/api/v1/subscribers/${user.subscriptionId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                subscriptionPreferences: profileData.subscriptionPreferences,
              }),
            });

            if (!subscriptionResponse.ok) {
              console.error("Failed to update subscription preferences");
              // Don't fail the entire update, just log the error
            }
          } catch (subscriptionError) {
            console.error("Error updating subscription preferences:", subscriptionError);
            // Don't fail the entire update, just log the error
          }
        }

        // Refresh user data after successful update
        const refreshResponse = await fetch(`/api/v1/users/${actualUserId}`);
        if (refreshResponse.ok) {
          const updatedUserData = await refreshResponse.json();
          
          // Fetch updated subscription data
          let updatedSubscriptionData = null;
          if (updatedUserData.subscriptionId) {
            try {
              const subscriptionResponse = await fetch(`/api/v1/subscribers/${updatedUserData.subscriptionId}`);
              if (subscriptionResponse.ok) {
                updatedSubscriptionData = await subscriptionResponse.json();
              }
            } catch (subscriptionError) {
              console.error("Error fetching updated subscription data:", subscriptionError);
            }
          }
          
          const transformedUser: IUser = {
            _id: updatedUserData._id || session.user.id,
            username: updatedUserData.username || session.user.name || "",
            email: updatedUserData.email || session.user.email || "",
            password: updatedUserData.password || "", // Password is optional in frontend
            role: updatedUserData.role || session.user.role || "user",
            birthDate: updatedUserData.birthDate
              ? new Date(updatedUserData.birthDate)
              : new Date("2000-02-29"),
            imageUrl: updatedUserData.imageUrl || session.user.imageUrl || "",
            emailVerified: updatedUserData.emailVerified || false,
            preferences: updatedUserData.preferences ? {
              language: updatedUserData.preferences.language || "en",
              region: updatedUserData.preferences.region || "US",
            } : {
              language: "en",
              region: "US",
            },
            subscriptionId: updatedUserData.subscriptionId || null,
            subscriptionPreferences: {
              categories: updatedSubscriptionData?.subscriptionPreferences?.categories || mainCategories,
              subscriptionFrequencies: updatedSubscriptionData?.subscriptionPreferences?.subscriptionFrequencies || "weekly",
            },
            likedArticles: updatedUserData.likedArticles || [],
            commentedArticles: updatedUserData.commentedArticles || [],
            createdAt: updatedUserData.createdAt || new Date().toISOString(),
            updatedAt: updatedUserData.updatedAt || new Date().toISOString(),
          };
          setUser(transformedUser);
        }
      } else {
        setError(result.message || "Failed to update profile");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    updateProfile,
    loading,
    error,
    isInitializing,
  };
};
