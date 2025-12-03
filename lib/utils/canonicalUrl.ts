import { getCategoryTranslation } from "@/lib/utils/routeTranslation";

const BASE_URL = process.env.NEXTAUTH_URL || 
                 process.env.VERCEL_URL || 
                 process.env.NEXT_PUBLIC_APP_URL || 
                 "https://womensspot.com";

/**
 * Generates a canonical URL for an article
 * Format: [baseUrl]/[locale-if-not-en]/[translated-category]/[slug]
 * 
 * @param category - English category name (e.g., "health", "nutrition")
 * @param slug - Article slug
 * @param locale - Language code (e.g., "en", "fr", "pt")
 * @returns Canonical URL string
 */
export function generateCanonicalUrl(
  category: string,
  slug: string,
  locale: string = "en"
): string {
  // Validate inputs
  if (!category || !slug) {
    throw new Error("Category and slug are required for canonical URL generation");
  }

  // Get translated category
  const translatedCategory = getCategoryTranslation(category, locale);

  // Build URL parts
  const parts: string[] = [BASE_URL];

  // Add locale only if not English
  if (locale !== "en") {
    parts.push(locale);
  }

  // Add translated category
  parts.push(translatedCategory);

  // Add slug
  parts.push(slug);

  return parts.join("/");
}

/**
 * Validates a canonical URL format
 * 
 * @param canonicalUrl - URL to validate
 * @param expectedCategory - Expected English category name
 * @param expectedSlug - Expected slug
 * @param expectedLocale - Expected locale
 * @returns Object with isValid boolean and error message if invalid
 */
export function validateCanonicalUrl(
  canonicalUrl: string,
  expectedCategory: string,
  expectedSlug: string,
  expectedLocale: string = "en"
): { isValid: boolean; error?: string } {
  try {
    const url = new URL(canonicalUrl);
    
    // Check base URL
    const baseUrl = BASE_URL.replace(/^https?:\/\//, "");
    if (!url.hostname.includes(baseUrl.replace(/^www\./, ""))) {
      return {
        isValid: false,
        error: `Invalid base URL. Expected domain containing "${baseUrl}"`
      };
    }

    // Parse path
    const pathParts = url.pathname.split("/").filter(Boolean);
    
    // Determine expected path structure
    const expectedCategoryTranslation = getCategoryTranslation(expectedCategory, expectedLocale);
    const expectedPathParts: string[] = [];
    
    // Add locale only if not English
    if (expectedLocale !== "en") {
      expectedPathParts.push(expectedLocale);
    }
    
    expectedPathParts.push(expectedCategoryTranslation);
    expectedPathParts.push(expectedSlug);

    // Validate path structure
    if (pathParts.length !== expectedPathParts.length) {
      return {
        isValid: false,
        error: `Invalid path structure. Expected ${expectedPathParts.length} parts, got ${pathParts.length}`
      };
    }

    // Validate each part
    if (expectedLocale !== "en" && pathParts[0] !== expectedLocale) {
      return {
        isValid: false,
        error: `Invalid locale. Expected "${expectedLocale}", got "${pathParts[0]}"`
      };
    }

    const categoryIndex = expectedLocale === "en" ? 0 : 1;
    if (pathParts[categoryIndex] !== expectedCategoryTranslation) {
      return {
        isValid: false,
        error: `Invalid category. Expected "${expectedCategoryTranslation}", got "${pathParts[categoryIndex]}"`
      };
    }

    const slugIndex = expectedLocale === "en" ? 1 : 2;
    if (pathParts[slugIndex] !== expectedSlug) {
      return {
        isValid: false,
        error: `Invalid slug. Expected "${expectedSlug}", got "${pathParts[slugIndex]}"`
      };
    }

    // Check for "articles" or its translations (FORBIDDEN)
    const forbiddenWords = ["articles", "artigos", "articulos", "artikel", "articoli", "artikelen"];
    const pathString = pathParts.join("/").toLowerCase();
    for (const word of forbiddenWords) {
      if (pathString.includes(word)) {
        return {
          isValid: false,
          error: `FORBIDDEN: URL contains "${word}" instead of category. Must use category translation.`
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Normalizes and fixes a canonical URL if invalid
 * 
 * @param canonicalUrl - URL to normalize
 * @param category - English category name
 * @param slug - Article slug
 * @param locale - Language code
 * @returns Normalized canonical URL
 */
export function normalizeCanonicalUrl(
  canonicalUrl: string | undefined,
  category: string,
  slug: string,
  locale: string = "en"
): string {
  // If no canonical URL provided, generate one
  if (!canonicalUrl) {
    return generateCanonicalUrl(category, slug, locale);
  }

  // Validate the provided URL
  const validation = validateCanonicalUrl(canonicalUrl, category, slug, locale);
  
  // If valid, return as-is
  if (validation.isValid) {
    return canonicalUrl;
  }

  // If invalid, generate correct one and log warning
  console.warn(`Invalid canonical URL detected: ${canonicalUrl}`);
  console.warn(`Error: ${validation.error}`);
  console.warn(`Generating correct canonical URL: ${generateCanonicalUrl(category, slug, locale)}`);
  
  return generateCanonicalUrl(category, slug, locale);
}

