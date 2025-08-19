'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const tSignIn = useTranslations('SignIn');
  const tSignUp = useTranslations('SignUp');
  const { user, isAuthenticated, logout } = useAuth();

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setIsLanguageMenuOpen(false);
    
    // Get current path without language prefix
    const pathWithoutLang = pathname?.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '';
    const newPath = `/${newLanguage}${pathWithoutLang || ''}`;
    
    // Use replace to avoid adding to browser history and ensure proper refresh
    router.replace(newPath);
  };

  // Handle logout
  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  // Get language display name
  const getLanguageDisplayName = (lang: string): string => {
    const displayNames: Record<string, string> = {
      'en': 'English',
      'pt': 'Português',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'nl': 'Nederlands',
      'he': 'עברית',
      'ru': 'Русский'
    };
    
    return displayNames[lang] || lang;
  };

  // Get flag emoji for language
  const getFlagEmoji = (lang: string): string => {
    const flags: Record<string, string> = {
      'en': '🇺🇸',
      'pt': '🇧🇷',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'nl': '🇳🇱',
      'he': '🇮🇱',
      'ru': '🇷🇺'
    };
    
    return flags[lang] || '🌐';
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <span className="text-xl font-bold">🏥 Health</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href={`/${locale}`}
              className="hover:text-gray-300 transition-colors"
            >
              {t('home')}
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href={`/${locale}/dashboard`}
                  className="hover:text-gray-300 transition-colors"
                >
                  {t('dashboard')}
                </Link>
                <Link 
                  href={`/${locale}/create-article`}
                  className="hover:text-gray-300 transition-colors"
                >
                  {t('createArticle')}
                </Link>
                <Link 
                  href={`/${locale}/profile`}
                  className="hover:text-gray-300 transition-colors"
                >
                  {t('profile')}
                </Link>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span>{getFlagEmoji(locale)}</span>
              <span>{getLanguageDisplayName(locale)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
                  {routing.locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                    >
                      <span className="text-lg">{getFlagEmoji(lang)}</span>
                      <span>{getLanguageDisplayName(lang)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span>👤</span>
                <span>{user?.email}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href={`/${locale}/signin`}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {tSignIn('signIn')}
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {tSignUp('signUp')}
                </Link>
              </div>
            )}

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    role="menuitem"
                  >
                    <span>🚪</span>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
