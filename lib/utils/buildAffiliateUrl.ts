import { affiliateCompanies } from "@/lib/constants";

// Builds an affiliate URL for a given company, region, and product
export function buildAffiliateUrl(
  affiliateCompany: keyof typeof affiliateCompanies, // The affiliate company key (e.g., "amazon")
  region: string, // The user's region code (e.g., "US", "BR", "ES", "FR", "DE", "IT", "UK", "CA", "AU", "IE", "NL")
  product?: string, // The product search term (optional)
  category?: string // The category name (optional, used when no product)
): string {
  const company = affiliateCompanies[affiliateCompany];

  // Map region codes (uppercase) to country keys (lowercase)
  // Handles various region code formats
  const regionToCountry: Record<
    string,
    keyof typeof company.country
  > = {
    US: "us",
    BR: "br",
    ES: "es",
    FR: "fr",
    DE: "de",
    IT: "it",
    UK: "uk",
    GB: "uk", // Great Britain also maps to UK
    CA: "ca",
    AU: "au",
    IE: "ie",
    NL: "nl",
  };

  // Normalize region to uppercase for lookup
  const normalizedRegion = region.toUpperCase();
  
  // Get country code, default to "us" if region doesn't match
  const country =
    regionToCountry[normalizedRegion] || ("us" as keyof typeof company.country);

  const countryConfig = company.country[country];

  // Determine search term: product > category > none
  let searchTerm = "";
  if (product) {
    searchTerm = product;
  } else if (category) {
    searchTerm = `book ${category}`;
  }

  // If we have a search term, build search URL
  if (searchTerm) {
    // Encode search term: replace spaces with + (Amazon format)
    // Then encode special characters, but keep + as + (not %2B)
    const encodedSearchTerm = encodeURIComponent(searchTerm.replace(/\s+/g, "+")).replace(/%2B/g, "+");
    
    // Build URL: https://www.amazon.[domain]/s?k=[searchTerm]&tag=[affiliateId]
    return `${company.baseUrl}${countryConfig.domain}/s?k=${encodedSearchTerm}&tag=${countryConfig.affiliateId}`;
  }

  // If no search term, build homepage URL with just affiliate tag
  // Format: https://www.amazon.[domain]/s?tag=[affiliateId]
  return `${company.baseUrl}${countryConfig.domain}/s?tag=${countryConfig.affiliateId}`;
}

