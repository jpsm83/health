'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Register new user through users endpoint, then sign in with NextAuth
  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
    birthDate: string;
  }) => {
    try {
      // Get browser language and region automatically
      const browserLanguage = navigator.language || 'en';
      const browserRegion = navigator.language.split('-')[1] || 'US';
      
      // First, create the user through the users endpoint
      const formData = new FormData();
      formData.append('username', userData.username);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('role', 'user'); // Default role for new users
      formData.append('birthDate', userData.birthDate);
      formData.append('language', browserLanguage);
      formData.append('region', browserRegion);
      formData.append('contentLanguage', browserLanguage);

      const response = await fetch('/api/v1/users', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Registration failed' };
      }

      // After successful registration, automatically sign in the user with NextAuth
      const loginResult = await signIn('credentials', {
        email: userData.email,
        password: userData.password,
        redirect: false,
      });

      if (loginResult?.ok) {
        await update(); // Update session
        return { success: true };
      } else {
        return { success: false, error: 'Registration successful but automatic login failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }, [update]);

  // Login with credentials or Google OAuth
  const login = useCallback(async (provider: 'google' | 'credentials', credentials?: { email: string; password: string }) => {
    try {
      if (provider === 'credentials' && credentials) {
        const result = await signIn('credentials', {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        if (result?.ok) {
          await update(); // Update session
          router.push('/dashboard');
          return { success: true };
        }
      } else if (provider === 'google') {
        await signIn('google', { callbackUrl: '/dashboard' });
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
    }
  }, [router, update]);

  // Sign out using custom endpoint (bypasses CSRF issues)
  const logout = useCallback(async () => {
    try {
      // Use custom signout endpoint to bypass CSRF issues
      const response = await fetch('/api/v1/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        // Clear the session on the client side
        await signOut({ redirect: false });
        router.push('/');
        return { success: true };
      } else {
        throw new Error('Signout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }, [router]);

  // Get current session info
  const getSession = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/auth/session', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const sessionData = await response.json();
        return { success: true, session: sessionData };
      } else {
        return { success: false, error: 'Failed to get session' };
      }
    } catch (error) {
      console.error('Get session error:', error);
      return { success: false, error: 'Failed to get session' };
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  // Get user info from session
  const getUser = useCallback(() => {
    if (session?.user) {
      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      };
    }
    return null;
  }, [session]);

  // Check if user has specific role
  const hasRole = useCallback((role: string) => {
    return session?.user?.role === role;
  }, [session]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      await update();
      return { success: true };
    } catch (error) {
      console.error('Session refresh error:', error);
      return { success: false, error: 'Failed to refresh session' };
    }
  }, [update]);

  // Forgot password - send reset email
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          success: true, 
          message: data.message,
          resetLink: data.resetLink // Only available in development
        };
      } else {
        return { success: false, error: data.message || 'Failed to send reset email' };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: 'Failed to send reset email' };
    }
  }, []);

  // Reset password with token
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message || 'Failed to reset password' };
      }
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }, []);

  return {
    // Session state
    user: getUser(),
    isAuthenticated,
    isLoading,
    session,
    
    // Authentication methods
    register,
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
