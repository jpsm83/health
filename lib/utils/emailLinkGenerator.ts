import { translateRouteToLocale } from "./routeTranslation";

// Generates a properly localized and translated email link
export function generateEmailLink(
  route: string, // English route name (e.g., "reset-password")
  params: Record<string, string>, // Query parameters as key-value pairs
  locale: string = "en" // User's preferred locale (defaults to "en")
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  
  // Translate the route name
  const translatedRoute = translateRouteToLocale(route, locale);
  
  // Build query string
  const queryString = new URLSearchParams(params).toString();
  
  // Construct full URL: /{locale}/{translated-route}?params
  return `${baseUrl}/${locale}/${translatedRoute}${queryString ? `?${queryString}` : ""}`;
}

