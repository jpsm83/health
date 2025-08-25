import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { userService } from '@/services/userService';
import type { IUpdateProfileData } from '@/services/userService';

// Interface for the user data that ProfilePage needs
interface ProfileUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  birthDate: string;
  imageUrl?: string;
  emailVerified: boolean;
  subscriptionPreferences: {
    categories: string[];
    subscriptionFrequencies: string;
  };
  likedArticles: string[];
  commentedArticles: string[];
  createdAt: string;
  updatedAt: string;
}

export const useUser = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch user data from database when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setUser(null);
        setUserLoading(false);
        return;
      }

      try {
        setUserLoading(true);
        const response = await fetch(`/api/v1/users/${session.user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        
        // Transform the database user data to match our ProfileUser interface
        const transformedUser: ProfileUser = {
          _id: userData._id || session.user.id,
          username: userData.username || session.user.name || '',
          email: userData.email || session.user.email || '',
          role: userData.role || session.user.role || 'user',
          birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '2000-02-29',
          imageUrl: userData.imageUrl || session.user.imageUrl || '',
          emailVerified: userData.emailVerified || false,
          subscriptionPreferences: userData.subscriptionPreferences || {
            categories: [],
            subscriptionFrequencies: "weekly"
          },
          likedArticles: userData.likedArticles || [],
          commentedArticles: userData.commentedArticles || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString(),
        };

        setUser(transformedUser);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        
        // Fallback to session data if database fetch fails
        if (session?.user) {
          const fallbackUser: ProfileUser = {
            _id: session.user.id,
            username: session.user.name || '',
            email: session.user.email || '',
            role: session.user.role || 'user',
            birthDate: '2000-02-29',
            imageUrl: session.user.imageUrl || '',
            emailVerified: false,
            subscriptionPreferences: {
              categories: [],
              subscriptionFrequencies: "weekly"
            },
            likedArticles: [],
            commentedArticles: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setUser(fallbackUser);
        }
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const updateProfile = async (profileData: IUpdateProfileData) => {
    if (!session?.user?.id) {
      setError('User not authenticated');
      return { success: false, message: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await userService.updateUserProfile(session.user.id, profileData);
      
      if (result.success) {
        // Refresh user data after successful update
        const response = await fetch(`/api/v1/users/${session.user.id}`);
        if (response.ok) {
          const updatedUserData = await response.json();
          const transformedUser: ProfileUser = {
            _id: updatedUserData._id || session.user.id,
            username: updatedUserData.username || session.user.name || '',
            email: updatedUserData.email || session.user.email || '',
            role: updatedUserData.role || session.user.role || 'user',
            birthDate: updatedUserData.birthDate ? new Date(updatedUserData.birthDate).toISOString().split('T')[0] : '2000-02-29',
            imageUrl: updatedUserData.imageUrl || session.user.imageUrl || '',
            emailVerified: updatedUserData.emailVerified || false,
            subscriptionPreferences: updatedUserData.subscriptionPreferences || {
              categories: [],
              subscriptionFrequencies: "weekly"
            },
            likedArticles: updatedUserData.likedArticles || [],
            commentedArticles: updatedUserData.commentedArticles || [],
            createdAt: updatedUserData.createdAt || new Date().toISOString(),
            updatedAt: updatedUserData.updatedAt || new Date().toISOString(),
          };
          setUser(transformedUser);
        }
      } else {
        setError(result.message || 'Failed to update profile');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
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
    userId: session?.user?.id,
    userLoading,
  };
};
