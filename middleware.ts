// The middleware automatically adds language prefixes to URLs and handles language detection for users visiting your application.

// How It Works
// 1. Language Detection & Routing
// Detects user's preferred language from browser headers
// Automatically redirects users to the appropriate language version
// Supports multiple languages: English (en), Portuguese (pt), Spanish (es), French (fr), German (de), Italian (it), Dutch (nl), Hebrew (he)

// 2. URL Structure
// Before: User visits /dashboard
// After: Automatically redirected to /en/dashboard (or their preferred language)

// 3. Smart Validation
// Validates that language prefixes in URLs are supported
// Redirects to default language if an invalid locale is detected
// Preserves existing language-prefixed URLs

// 4. Performance Optimization
// Skips API routes (/api/*) - no unnecessary processing
// Skips static files (/_next/*, /favicon.ico) - faster loading
// Skips files with extensions (.css, .js, etc.)

// Why It's Important
// This middleware ensures that:
// All users get the right language version automatically
// SEO-friendly URLs with language prefixes
// Consistent routing across your multilingual health application
// Better user experience for international users

// It's essentially the "traffic controller" that makes sure users land on the correct language version of your health content without manual intervention.

import { NextRequest, NextResponse } from 'next/server';
import { detectUserLanguage, isSupportedLocale } from '@/app/api/utils/languageUtils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the path already has a language prefix
  const pathnameHasLocale = /^\/(?:en|pt|es|fr|de|it|nl|he)\//.test(pathname);
  
  if (pathnameHasLocale) {
    // Extract the locale from the path
    const locale = pathname.split('/')[1];
    
    // Validate the locale
    if (!isSupportedLocale(locale)) {
      // Redirect to default locale if invalid
      const defaultLocale = detectUserLanguage(request.headers);
      const newUrl = new URL(`/${defaultLocale}${pathname}`, request.url);
      return NextResponse.redirect(newUrl);
    }
    
    return NextResponse.next();
  }

  // If no locale in path, detect user's preferred language
  const userLocale = detectUserLanguage(request.headers);
  
  // Create new URL with locale prefix
  const newUrl = new URL(`/${userLocale}${pathname}`, request.url);
  
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}; 