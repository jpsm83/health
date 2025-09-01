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
        
        // Transform the database user data to match our IUser interface
        const transformedUser: Partial<IUser> = {
          _id: userData._id || session.user.id,
          username: userData.username || session.user.name || "",
          email: userData.email || session.user.email || "",
          role: userData.role || session.user.role || "user",
          birthDate: userData.birthDate
            ? new Date(userData.birthDate)
            : new Date("2000-02-29"),
          imageUrl: userData.imageUrl || session.user.imageUrl || "",
          emailVerified: userData.emailVerified || false,
          preferences: userData.preferences || {
            language: "en",
            region: "US",
            contentLanguage: "en",
          },
          subscriptionPreferences: {
            categories: userData.subscriptionPreferences?.categories || mainCategories,
            subscriptionFrequencies: userData.subscriptionPreferences?.subscriptionFrequencies || "weekly",
          },
          likedArticles: userData.likedArticles || [],
          commentedArticles: userData.commentedArticles || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        };

        setUser(transformedUser as IUser);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");

        // Fallback to session data if database fetch fails
        if (session?.user) {
          const fallbackUser: Partial<IUser> = {
            _id: session.user.id,
            username: session.user.name || "",
            email: session.user.email || "",
            role: session.user.role || "user",
            birthDate: new Date("2000-02-29"),
            imageUrl: session.user.imageUrl || "",
            emailVerified: false,
            preferences: {
              language: "en",
              region: "US",
              contentLanguage: "en",
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
          setUser(fallbackUser as IUser);
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

      const result = await userService.updateUserProfile(
        actualUserId,
        profileData
      );

      if (result.success) {
        // Refresh user data after successful update
        const refreshResponse = await fetch(`/api/v1/users/${actualUserId}`);
        if (refreshResponse.ok) {
          const updatedUserData = await refreshResponse.json();
          const transformedUser: Partial<IUser> = {
            _id: updatedUserData._id || session.user.id,
            username: updatedUserData.username || session.user.name || "",
            email: updatedUserData.email || session.user.email || "",
            role: updatedUserData.role || session.user.role || "user",
            birthDate: updatedUserData.birthDate
              ? new Date(updatedUserData.birthDate)
              : new Date("2000-02-29"),
            imageUrl: updatedUserData.imageUrl || session.user.imageUrl || "",
            emailVerified: updatedUserData.emailVerified || false,
            preferences: updatedUserData.preferences || {
              language: "en",
              region: "US",
              contentLanguage: "en",
            },
            subscriptionPreferences: {
              categories: updatedUserData.subscriptionPreferences?.categories || mainCategories,
              subscriptionFrequencies: updatedUserData.subscriptionPreferences?.subscriptionFrequencies || "weekly",
            },
            likedArticles: updatedUserData.likedArticles || [],
            commentedArticles: updatedUserData.commentedArticles || [],
            createdAt: updatedUserData.createdAt || new Date().toISOString(),
            updatedAt: updatedUserData.updatedAt || new Date().toISOString(),
          };
          setUser(transformedUser as IUser);
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
