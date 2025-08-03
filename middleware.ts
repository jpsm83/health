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