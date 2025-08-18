'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { shouldRedirectToLanguage } from '@/lib/utils/languageUtils';

export default function LanguageRedirect() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side and for non-language routes
    if (typeof window !== 'undefined' && !pathname.match(/^\/[a-z]{2}(-[A-Z]{2})?$/)) {
      const { shouldRedirect, targetLanguage } = shouldRedirectToLanguage(pathname);
      
      if (shouldRedirect) {
        // Redirect to the language-specific route
        router.push(`/${targetLanguage}`);
      }
    }
  }, [pathname, router]);

  return null; // This component doesn't render anything
}
