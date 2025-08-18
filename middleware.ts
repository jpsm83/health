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
import { getAllLanguageCodes, detectUserLanguage } from '@/lib/utils/languageUtils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // If user is on the root path, detect language and redirect
  if (pathname === '/') {
    const preferredLanguage = detectUserLanguage(request.headers);
    
    // Extract language code from locale (e.g., 'pt-BR' -> 'pt')
    const langCode = preferredLanguage.split('-')[0];
    
    // Redirect to language-specific route
    const url = request.nextUrl.clone();
    url.pathname = `/${langCode}`;
    return NextResponse.redirect(url);
  }

  // Validate that the locale is supported
  if (pathname.startsWith('/') && pathname.split('/').length > 1) {
    const lang = pathname.split('/')[1];
    if (getAllLanguageCodes().includes(lang)) {
      // Valid language route, continue
      return NextResponse.next();
    } else if (lang !== 'api' && lang !== '_next' && lang !== 'favicon.ico') {
      // Invalid route, redirect to default language
      const url = request.nextUrl.clone();
      url.pathname = '/en';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 