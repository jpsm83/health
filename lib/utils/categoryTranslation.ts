import { mainCategories } from "@/lib/constants";

/**
 * Locale-first category translations
 * Single source of truth for all category translations
 * Based on the category translation mappings from documentation
 */
const categoryTranslations: Record<string, Record<string, string>> = {
  health: { en: "health", pt: "saude", es: "salud", fr: "sante", de: "gesundheit", it: "salute" },
  fitness: { en: "fitness", pt: "fitness", es: "fitness", fr: "fitness", de: "fitness", it: "fitness" },
  nutrition: { en: "nutrition", pt: "nutricao", es: "nutricion", fr: "nutrition", de: "ernahrung", it: "nutrizione" },
  intimacy: { en: "intimacy", pt: "intimidade", es: "intimidad", fr: "intimite", de: "intimitat", it: "intimita" },
  beauty: { en: "beauty", pt: "beleza", es: "belleza", fr: "beaute", de: "schonheit", it: "bellezza" },
  "weight-loss": { en: "weight-loss", pt: "perda-de-peso", es: "perdida-de-peso", fr: "perte-de-poids", de: "gewichtsverlust", it: "perdita-di-peso" },
  life: { en: "life", pt: "vida", es: "vida", fr: "vie", de: "leben", it: "vita" },
};

// Converts a translated category name to its English equivalent
export function translateCategoryToEnglish(category: string): string {
  const lowerCategory = category.toLowerCase();
  
  // Check if it's already English
  if (categoryTranslations[lowerCategory]?.en === lowerCategory) {
    return lowerCategory;
  }
  
  // Search through all categories to find the English equivalent
  for (const [english, translations] of Object.entries(categoryTranslations)) {
    if (Object.values(translations).includes(lowerCategory)) {
      return english;
    }
  }
  
  return category; // Fallback
}

// Converts an English category name to its locale-specific equivalent
export function translateCategoryToLocale(englishCategory: string, locale: string): string {
  if (locale === "en") return englishCategory;
  return categoryTranslations[englishCategory]?.[locale] || englishCategory;
}

// Gets all valid category names (English + all translations)
export function getAllValidCategories(): string[] {
  const allCategories: string[] = [];
  Object.values(categoryTranslations).forEach(translations => {
    allCategories.push(...Object.values(translations));
  });
  return [...new Set(allCategories)]; // Remove duplicates
}

// Check if a category is an English category name
export function isEnglishCategory(category: string): boolean {
  return mainCategories.includes(category.toLowerCase());
}

