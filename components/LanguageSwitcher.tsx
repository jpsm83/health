'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupportedLanguages, getLanguageConfig } from '@/lib/utils/languageUtils';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const router = useRouter();
  const pathname = usePathname();

  const supportedLanguages = getSupportedLanguages();

  useEffect(() => {
    // Extract current language from URL
    if (pathname.startsWith('/article/')) {
      const langMatch = pathname.match(/\/article\/([^\/]+)/);
      if (langMatch) {
        setCurrentLanguage(langMatch[1]);
      }
    }
  }, [pathname]);

  const handleLanguageChange = (langCode: string) => {
    setIsOpen(false);
    
    if (pathname.startsWith('/article/')) {
      // If we're on an article page, change the language in the URL
      const newPath = pathname.replace(/^\/article\/[^\/]+/, `/article/${langCode}`);
      router.push(newPath);
    } else {
      // If we're on another page, redirect to a default article in that language
      router.push(`/article/${langCode}/welcome`);
    }
  };

  const currentLangConfig = getLanguageConfig(currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
      >
        <span>{currentLangConfig.country === 'US' ? '🇺🇸' : 
               currentLangConfig.country === 'BR' ? '🇧🇷' :
               currentLangConfig.country === 'PT' ? '🇵🇹' :
               currentLangConfig.country === 'ES' ? '🇪🇸' :
               currentLangConfig.country === 'MX' ? '🇲🇽' :
               currentLangConfig.country === 'FR' ? '🇫🇷' :
               currentLangConfig.country === 'DE' ? '🇩🇪' :
               currentLangConfig.country === 'IT' ? '🇮🇹' :
               currentLangConfig.country === 'NL' ? '🇳🇱' :
               currentLangConfig.country === 'IL' ? '🇮🇱' :
               currentLangConfig.country === 'RU' ? '🇷🇺' : '🌐'}</span>
        <span>{currentLangConfig.language.toUpperCase()}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                currentLanguage === lang.code ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{lang.country === 'US' ? '🇺🇸' : 
                       lang.country === 'BR' ? '🇧🇷' :
                       lang.country === 'PT' ? '🇵🇹' :
                       lang.country === 'ES' ? '🇪🇸' :
                       lang.country === 'MX' ? '🇲🇽' :
                       lang.country === 'FR' ? '🇫🇷' :
                       lang.country === 'DE' ? '🇩🇪' :
                       lang.country === 'IT' ? '🇮🇹' :
                       lang.country === 'NL' ? '🇳🇱' :
                       lang.country === 'IL' ? '🇮🇱' :
                       lang.country === 'RU' ? '🇷🇺' : '🌐'}</span>
                <span className="font-medium">{lang.displayName}</span>
                <span className="text-sm text-gray-500">({lang.code.toUpperCase()})</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
