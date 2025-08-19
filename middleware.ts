import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales: locales,
  
  // Used when no locale matches
  defaultLocale: defaultLocale,
  
  // Always show the locale in the URL
  localePrefix: 'always',
  
  // Detect user's preferred language from Accept-Language header
  localeDetection: true,
  
  // Ensure proper fallback
  alternateLinks: true
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(pt|en|es|fr|de|it|nl|he|ru)/:path*']
}; 