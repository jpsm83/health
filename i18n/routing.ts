import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'pt', 'es', 'fr', 'de', 'it', 'he'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});