// This is a comprehensive internationalization utility module that handles all language-related functionality for your health application. Here's what it does:

// Middleware Integration
// Works with your middleware.ts to automatically route users to correct language versions
// Provides the language detection logic for automatic redirects

// Article System
// Generates proper URLs for articles in different languages
// Ensures SEO-friendly URLs with language prefixes
// Creates hreflang relationships between language versions

// Database Validation
// Used in your article API routes to validate language configurations
// Ensures URL patterns match language settings
// Prevents mismatched language/URL combinations

// Why It's Essential
// This utility is the backbone of your multilingual health platform because it:
// Automates language detection for better user experience
// Ensures SEO compliance with proper hreflang tags
// Maintains consistency across all language versions
// Scales easily when adding new languages
// Provides type safety with TypeScript

// It's essentially the "language brain" that makes your health content accessible to users worldwide in their preferred language!

import { languageConfig } from "@/lib/constants";

export type SupportedLocale = keyof typeof languageConfig;

// Detect user's preferred language based on headers
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
    'he': 'he-IL'
  };
  
  return languageMap[language] || null;
}

// Generate URL for article based on locale
export function generateArticleUrl(
  slug: string, 
  locale: SupportedLocale, 
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
): string {
  const config = languageConfig[locale];
  if (!config) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  
  return `${baseUrl}/${config.language}/${config.urlPattern}/${slug}`;
}

// Generate all alternate URLs for an article
export function generateAlternateUrls(
  slug: string,
  supportedLocales: SupportedLocale[],
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
): Record<string, string> {
  const alternates: Record<string, string> = {};
  
  for (const locale of supportedLocales) {
    const config = languageConfig[locale];
    if (config) {
      alternates[config.hreflang] = generateArticleUrl(slug, locale, baseUrl);
    }
  }
  
  return alternates;
}

// Get language configuration for a locale
export function getLanguageConfig(locale: SupportedLocale) {
  return languageConfig[locale];
}

// Validate if a locale is supported
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in languageConfig;
}

// Get all supported locales for a language
export function getLocalesForLanguage(language: string): SupportedLocale[] {
  return Object.entries(languageConfig)
    .filter(([, config]) => config.language === language)
    .map(([locale]) => locale as SupportedLocale);
}

// Generate structured data for article
export function generateArticleStructuredData(
  article: { contentsByLanguage: Array<{ mainTitle: string; seo: { metaDescription: string; canonicalUrl: string; hreflang: string } }>; articleImages?: string[]; createdAt?: Date; updatedAt?: Date },
  locale: SupportedLocale,
  baseUrl: string
) {
  const config = languageConfig[locale];
  const content = article.contentsByLanguage.find(
    (c) => c.seo.hreflang === locale
  );
  
  if (!content) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": content.mainTitle,
    "description": content.seo.metaDescription,
    "image": article.articleImages?.[0], // Use articleImages directly
    "author": {
      "@type": "Organization",
      "name": "Your Health Website"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Health Website",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": article.createdAt,
    "dateModified": article.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": content.seo.canonicalUrl
    },
    "inLanguage": config.hreflang,
    "url": content.seo.canonicalUrl
  };
} 