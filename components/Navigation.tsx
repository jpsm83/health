'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { locales } from '@/i18n';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation');
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

          {/* Right side - Language Switcher and Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                <span className="text-lg">{getFlagEmoji(locale)}</span>
                <span>{locale.toUpperCase()}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                  {locales.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        locale === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getFlagEmoji(lang)}</span>
                        <span className="font-medium">{getLanguageDisplayName(lang)}</span>
                        <span className="text-sm text-gray-500">({lang.toUpperCase()})</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-900 font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href={`/${locale}/profile`}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/${locale}/signin`}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href={`/${locale}`}
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {t('home')}
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href={`/${locale}/dashboard`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {t('dashboard')}
                </Link>
                <Link 
                  href={`/${locale}/create-article`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {t('createArticle')}
                </Link>
                <Link 
                  href={`/${locale}/profile`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {t('profile')}
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link 
                  href={`/${locale}/signin`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href={`/${locale}/signup`}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
