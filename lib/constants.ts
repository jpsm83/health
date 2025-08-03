// Library Shared constants
// App Constants

export const genders = ["man", "woman", "other"];

export const mainCategories = ["w-health", "w-fitness", "w-nutrition", "w-sex", "w-gym-wear", "w-beauty", "w-travel", "m-health", "m-fitness", "m-nutrition", "m-technology-gear", "m-grooming", "m-mvp-fitness-training-plans"];

export const newsletterFrequencies = ["daily", "weekly", "monthly"];

export const roles = ["admin", "user"];

export const articleStatus = ["published", "archived"];

// Language Configuration - Single source of truth
export const languageConfig = {
  "en-US": {
    language: "en",
    locale: "en-US",
    urlPattern: "articles",
    hreflang: "en-US",
    country: "US"
  },
  "pt-BR": {
    language: "pt",
    locale: "pt-BR", 
    urlPattern: "artigos",
    hreflang: "pt-BR",
    country: "BR"
  },
  "pt-PT": {
    language: "pt",
    locale: "pt-PT",
    urlPattern: "artigos", 
    hreflang: "pt-PT",
    country: "PT"
  },
  "es-ES": {
    language: "es",
    locale: "es-ES",
    urlPattern: "articulos",
    hreflang: "es-ES", 
    country: "ES"
  },
  "es-MX": {
    language: "es",
    locale: "es-MX",
    urlPattern: "articulos",
    hreflang: "es-MX",
    country: "MX"
  },
  "fr-FR": {
    language: "fr",
    locale: "fr-FR",
    urlPattern: "articles",
    hreflang: "fr-FR",
    country: "FR"
  },
  "de-DE": {
    language: "de",
    locale: "de-DE", 
    urlPattern: "artikel",
    hreflang: "de-DE",
    country: "DE"
  },
  "it-IT": {
    language: "it",
    locale: "it-IT",
    urlPattern: "articoli",
    hreflang: "it-IT",
    country: "IT"
  },
  "nl-NL": {
    language: "nl",
    locale: "nl-NL",
    urlPattern: "artikelen",
    hreflang: "nl-NL",
    country: "NL"
  },
  "he-IL": {
    language: "he",
    locale: "he-IL",
    urlPattern: "מאמרים",
    hreflang: "he-IL",
    country: "IL"
  }
};

// Derived arrays from languageConfig (for backward compatibility if needed)
export const supportedLocales = Object.keys(languageConfig);
export const supportedLanguages = [...new Set(Object.values(languageConfig).map(config => config.language))];

// Legacy exports for backward compatibility (can be removed later)
export const languagesPrefixes = supportedLanguages;
export const localesPrefixes = supportedLocales;