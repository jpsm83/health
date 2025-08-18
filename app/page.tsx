import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { locales, defaultLocale, type Locale } from '@/i18n';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  // Parse Accept-Language header to get preferred language
  let preferredLocale: Locale = defaultLocale;
  
  if (acceptLanguage) {
    // Extract language codes from Accept-Language header
    const languages = acceptLanguage
      .split(',')
      .map((lang: string) => lang.split(';')[0].trim().substring(0, 2))
      .filter((lang: string) => locales.includes(lang as Locale));
    
    if (languages.length > 0) {
      preferredLocale = languages[0] as Locale;
    }
  }
  
  redirect(`/${preferredLocale}`);
}
