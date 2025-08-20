'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useAuth = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

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

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';

  return {
    user: session?.user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    update,
  };
};
