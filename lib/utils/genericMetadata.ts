import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/*
 * SOCIAL MEDIA METADATA CONFIGURATION
 *
 * This file provides comprehensive metadata for all major social media platforms:
 *
 * ✅ Facebook, Instagram, LinkedIn, WhatsApp, Discord (Open Graph)
 * ✅ Twitter/X (Twitter Cards)
 * ✅ Pinterest (Rich Pins)
 * ✅ LinkedIn (Company Page)
 * ✅ WhatsApp (Link Previews)
 * ✅ Telegram (Link Previews)
 * ✅ Slack (Link Previews)
 * ✅ Email clients (Outlook, Gmail, etc.)
 *
 * CUSTOMIZATION NEEDED:
 * - Replace 'contact@womensspot.com' with your actual email
 * - Replace '@womensspot' with your actual Twitter handle
 * - Replace 'womensspot' with your actual LinkedIn company page
 * - Add verification codes when you have them (Google, Facebook, etc.)
 * - Update theme colors if different from #8B5CF6
 */

// Language mapping for proper hreflang values
export const languageMap: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

// Supported locales
export const supportedLocales = [
  "en",
  "pt",
  "es",
  "fr",
  "de",
  "it",
];

// Generate language alternates for a given route
export function generateLanguageAlternates(
  route: string
): Record<string, string> {
  const languageAlternates: Record<string, string> = {};

  supportedLocales.forEach((lang) => {
    const properLangCode = languageMap[lang] || lang;
    languageAlternates[properLangCode] = `/${lang}${route}`;
  });

  return languageAlternates;
}

// Base metadata configuration
export const baseMetadata = {
  authors: [{ name: "Women's Spot Team" }],
  creator: "Women's Spot",
  publisher: "Women's Spot",
  siteName: "Women's Spot",
  images: [
    {
      url: "/womens-spot.png",
      width: 1200,
      height: 630,
      alt: "Women's Spot - Empowering Women",
    },
  ],
};

// Core metadata generation function (private implementation)
async function generateMetadataCore(
  locale: string,
  route: string,
  titleKey: string,
  isPublic: boolean
): Promise<Metadata> {
  // Dynamically load translations using next-intl
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Extract page name from the key (e.g., 'metadata.home.title' -> 'home')
  const pageName = titleKey.split(".")[1] || "home";

  // Get translated content dynamically
  const title = t(`${pageName}.title`);
  const description = t(`${pageName}.description`);
  const keywords = t(`${pageName}.keywords`);

  const properLang = languageMap[locale] || locale;
  const languageAlternates = generateLanguageAlternates(route);
  const fullUrl = `${
    process.env.NEXTAUTH_URL
  }/${locale}${route}`;

  return {
    title,
    description,
    keywords,
    ...baseMetadata,
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
    robots: isPublic ? "index, follow" : "noindex, nofollow",
    alternates: {
      canonical: `/${locale}${route}`,
      languages: languageAlternates,
    },
    // Enhanced Open Graph for Facebook, LinkedIn, WhatsApp, Discord, etc.
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: baseMetadata.siteName,
      locale: properLang,
      type: "website",
      // Better image handling
      images: baseMetadata.images.map((img) => ({
        ...img,
        type: "image/png",
        secureUrl: img.url.startsWith("https") ? img.url : undefined,
      })),
    },
    // Enhanced Twitter Cards for better Twitter sharing
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: baseMetadata.images.map((img) => img.url),
      // Additional Twitter properties
      creator: "@womensspot", // Add your actual Twitter handle
      site: "@womensspot", // Add your actual Twitter handle
    },
    // Additional metadata for other platforms
    other: {
      language: locale,
      // LinkedIn specific
      "linkedin:owner": "womensspot", // Add your LinkedIn company page
      // Pinterest specific
      "pinterest:rich-pin": "true",
      // WhatsApp specific
      "whatsapp:description": description,
      // General social media
      "theme-color": "#8B5CF6", // Purple color from your brand
      "msapplication-TileColor": "#8B5CF6",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": baseMetadata.siteName,
      // Modern mobile web app support
      "application-name": baseMetadata.siteName,
      "msapplication-config": "/browserconfig.xml",
      "format-detection": "telephone=no",
      // Additional SEO
      author: baseMetadata.authors[0].name,
      copyright: `© ${new Date().getFullYear()} ${
        baseMetadata.siteName
      }. All rights reserved.`,
      distribution: "global",
      rating: "general",
      "revisit-after": "7 days",
      robots: isPublic
        ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        : "noindex, nofollow",
    },
    // Enhanced verification for social platforms
    verification: {
      // Add these when you have them
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
      // facebook: 'your-facebook-app-id',
      // twitter: 'your-twitter-username',
    },
  };
}

// Generate metadata for public pages (indexable) with dynamic language support
export async function generatePublicMetadata(
  locale: string,
  route: string,
  titleKey: string
): Promise<Metadata> {
  return generateMetadataCore(locale, route, titleKey, true);
}

// Generate metadata for private pages (noindex) with dynamic language support
export async function generatePrivateMetadata(
  locale: string,
  route: string,
  titleKey: string
): Promise<Metadata> {
  return generateMetadataCore(locale, route, titleKey, false);
}
