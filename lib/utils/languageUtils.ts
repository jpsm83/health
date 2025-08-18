import { languageConfig, supportedLocales, supportedLanguages } from '@/lib/constants';

// ============================================================================
// CLIENT-SIDE FUNCTIONS (for components and pages)
// ============================================================================

// Get user's preferred language from browser
export function getBrowserLanguage(): string {
  if (typeof window === 'undefined') return 'en'; // SSR fallback
  
  const browserLang = navigator.language || navigator.languages?.[0] || 'en';
  const shortLang = browserLang.split('-')[0];
  
  // Check if we support the full locale
  if (supportedLocales.includes(browserLang)) {
    return languageConfig[browserLang as keyof typeof languageConfig].language;
  }
  
  // Check if we support the short language
  if (supportedLanguages.includes(shortLang)) {
    return shortLang;
  }
  
  return 'en'; // Default fallback
}

// Validate if a language is supported
export function isValidLanguage(lang: string): boolean {
  return supportedLanguages.includes(lang);
}

// Get language config for a specific language
export function getLanguageConfig(lang: string) {
  const locale = Object.values(languageConfig).find(config => config.language === lang);
  return locale || languageConfig['en-US'];
}

// Get all supported languages with their display names
export function getSupportedLanguages() {
  return Object.values(languageConfig).map(config => ({
    code: config.language,
    locale: config.locale,
    country: config.country,
    displayName: getLanguageDisplayName(config.language)
  }));
}

// Get display name for a language
function getLanguageDisplayName(lang: string): string {
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
}

// Get the default language for the app
export function getDefaultLanguage(): string {
  return 'en';
}

// Check if we should redirect to a language-specific route (CLIENT)
export function shouldRedirectToLanguage(currentPath: string): { shouldRedirect: boolean; targetLanguage: string } {
  // If we're already on a language route, don't redirect
  if (currentPath.match(/^\/[a-z]{2}(-[A-Z]{2})?/)) {
    return { shouldRedirect: false, targetLanguage: '' };
  }
  
  const browserLang = getBrowserLanguage();
  const defaultLang = getDefaultLanguage();
  
  // If browser language is supported and different from default, redirect
  if (browserLang !== defaultLang && isValidLanguage(browserLang)) {
    return { shouldRedirect: true, targetLanguage: browserLang };
  }
  
  return { shouldRedirect: false, targetLanguage: '' };
}

// ============================================================================
// SERVER-SIDE FUNCTIONS (for middleware and API routes)
// ============================================================================

export type SupportedLocale = keyof typeof languageConfig;

// Detect user's preferred language based on headers (SERVER)
export function detectUserLanguage(headers: Headers): SupportedLocale {
  const acceptLanguage = headers.get('accept-language');
  const cfCountry = headers.get('cf-ipcountry'); // Cloudflare country header
  
  if (!acceptLanguage) {
    return 'en-US';
  }

  // Parse accept-language header
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [language, quality = '1'] = lang.trim().split(';q=');
      return { language: language.toLowerCase(), quality: parseFloat(quality) };
    })
    .sort((a, b) => b.quality - a.quality);

  // Try to match with country-specific locale
  for (const { language } of languages) {
    const langCode = language.split('-')[0];
    
    // If we have country info, try to match with country-specific locale
    if (cfCountry) {
      const countrySpecificLocale = `${langCode}-${cfCountry.toUpperCase()}` as SupportedLocale;
      if (countrySpecificLocale in languageConfig) {
        return countrySpecificLocale;
      }
    }
    
    // Fallback to default locale for language
    const defaultLocale = getDefaultLocaleForLanguage(langCode);
    if (defaultLocale) {
      return defaultLocale;
    }
  }

  return 'en-US';
}

// Get default locale for a language code
export function getDefaultLocaleForLanguage(language: string): SupportedLocale | null {
  const languageMap: Record<string, SupportedLocale> = {
    'en': 'en-US',
    'pt': 'pt-BR',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'nl': 'nl-NL',
    'he': 'he-IL',
    'ru': 'ru-RU'
  };
  
  return languageMap[language] || null;
}

// Validate if a locale is supported (SERVER)
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in languageConfig;
}

// Get all supported locales for a language
export function getLocalesForLanguage(language: string): SupportedLocale[] {
  return Object.entries(languageConfig)
    .filter(([, config]) => config.language === language)
    .map(([locale]) => locale as SupportedLocale);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get language from URL path
export function getLanguageFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/([a-z]{2})(-[A-Z]{2})?/);
  return match ? match[1] : null;
}

// Check if path is a language route
export function isLanguageRoute(pathname: string): boolean {
  return /^\/[a-z]{2}(-[A-Z]{2})?/.test(pathname);
}

// Get all supported language codes
export function getAllLanguageCodes(): string[] {
  return supportedLanguages;
}

// Get all supported locale codes
export function getAllLocaleCodes(): string[] {
  return supportedLocales;
}
