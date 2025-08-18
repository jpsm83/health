'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getBrowserLanguage, getLanguageConfig, getSupportedLanguages } from '@/lib/utils/languageUtils';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navigation() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Detect user's language on component mount
  useEffect(() => {
    const userLanguage = getBrowserLanguage();
    setCurrentLanguage(userLanguage);
  }, []);

  // Get language configuration for current language
  const langConfig = getLanguageConfig(currentLanguage);
  const supportedLanguages = getSupportedLanguages();

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    setIsLanguageMenuOpen(false);
    
    // Get current path without language prefix
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
    const newPath = `/${newLanguage}${pathWithoutLang || ''}`;
    
    // Navigate to new language path
    router.push(newPath);
  };

  // Get current language from URL path
  const getCurrentLanguageFromPath = () => {
    const match = pathname.match(/^\/([a-z]{2})(-[A-Z]{2})?/);
    return match ? match[1] : currentLanguage;
  };

  // Update current language when URL changes
  useEffect(() => {
    const pathLang = getCurrentLanguageFromPath();
    if (pathLang !== currentLanguage) {
      setCurrentLanguage(pathLang);
    }
  }, [pathname, currentLanguage]);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href={`/${currentLanguage}`} className="flex items-center space-x-2">
              <span className="text-xl font-bold">🏥 Health</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href={`/${currentLanguage}`}
              className="hover:text-gray-300 transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href={`/${currentLanguage}/dashboard`}
              className="hover:text-gray-300 transition-colors"
            >
              {t('navigation.dashboard')}
            </Link>
            <Link 
              href={`/${currentLanguage}/create-article`}
              className="hover:text-gray-300 transition-colors"
            >
              {t('navigation.createArticle')}
            </Link>
            <Link 
              href={`/${currentLanguage}/profile`}
              className="hover:text-gray-300 transition-colors"
            >
              {t('navigation.profile')}
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              <span className="text-lg">
                {langConfig.country === 'US' ? '🇺🇸' :
                 langConfig.country === 'BR' ? '🇧🇷' :
                 langConfig.country === 'PT' ? '🇵🇹' :
                 langConfig.country === 'ES' ? '🇪🇸' :
                 langConfig.country === 'MX' ? '🇲🇽' :
                 langConfig.country === 'FR' ? '🇫🇷' :
                 langConfig.country === 'DE' ? '🇩🇪' :
                 langConfig.country === 'IT' ? '🇮🇹' :
                 langConfig.country === 'NL' ? '🇳🇱' :
                 langConfig.country === 'IL' ? '🇮🇱' :
                 langConfig.country === 'RU' ? '🇷🇺' : '🌐'}
              </span>
              <span>{currentLanguage.toUpperCase()}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.locale}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                      currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {lang.country === 'US' ? '🇺🇸' :
                         lang.country === 'BR' ? '🇧🇷' :
                         lang.country === 'PT' ? '🇵🇹' :
                         lang.country === 'ES' ? '🇪🇸' :
                         lang.country === 'MX' ? '🇲🇽' :
                         lang.country === 'FR' ? '🇫🇷' :
                         lang.country === 'DE' ? '🇩🇪' :
                         lang.country === 'IT' ? '🇮🇹' :
                         lang.country === 'NL' ? '🇳🇱' :
                         lang.country === 'IL' ? '🇮🇱' :
                         lang.country === 'RU' ? '🇷🇺' : '🌐'}
                      </span>
                      <span className="font-medium">{lang.displayName}</span>
                      <span className="text-sm text-gray-500">({lang.code.toUpperCase()})</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href={`/${currentLanguage}`}
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <Link 
              href={`/${currentLanguage}/dashboard`}
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {t('navigation.dashboard')}
            </Link>
            <Link 
              href={`/${currentLanguage}/create-article`}
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {t('navigation.createArticle')}
            </Link>
            <Link 
              href={`/${currentLanguage}/profile`}
              className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {t('navigation.profile')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
