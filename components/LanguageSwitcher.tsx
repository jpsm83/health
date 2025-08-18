'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/i18n';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (langCode: string) => {
    setIsOpen(false);
    
    // Get current path without language prefix
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '');
    const newPath = `/${langCode}${pathWithoutLang || ''}`;
    
    // Use replace to avoid adding to browser history and ensure proper refresh
    router.replace(newPath);
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        <span>{getFlagEmoji(currentLocale)}</span>
        <span>{currentLocale.toUpperCase()}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
          {locales.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                currentLocale === lang ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{getFlagEmoji(lang)}</span>
                <span className="font-medium">{getLanguageDisplayName(lang)}</span>
                <span className="text-sm text-gray-500">({lang.toUpperCase()})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
