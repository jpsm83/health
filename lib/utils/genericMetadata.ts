import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ISocialMedia } from "@/types/article";

// Helper function to extract social media images from article data
export function extractSocialMediaImages(socialMedia?: ISocialMedia): {
  facebook?: string;
  instagram?: string;
  xTwitter?: string;
  pinterest?: string;
  tiktok?: string;
  threads?: string;
} | undefined {
  if (!socialMedia) return undefined;
  
  return {
    facebook: socialMedia.facebook?.postImage,
    instagram: socialMedia.instagram?.postImage,
    xTwitter: socialMedia.xTwitter?.postImage,
    pinterest: socialMedia.pinterest?.postImage,
    tiktok: socialMedia.tiktok?.postImage,
    threads: socialMedia.threads?.postImage,
  };
}

/*
 * GENERIC METADATA CONFIGURATION
 *
 * Provides clean, optimized metadata for all major social media platforms:
 *
 * ✅ Facebook, Instagram, LinkedIn, WhatsApp, Discord (Open Graph)
 * ✅ Twitter/X (Twitter Cards)
 * ✅ Pinterest (Rich Pins)
 * ✅ Threads (Meta's Twitter competitor)
 *
 * CUSTOMIZATION:
 * - Replace '@womensspot' with your actual social media handles
 * - Add verification codes when available
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
      width: 1024,
      height: 1024,
      alt: "Women's Spot - Empowering Women",
      type: "image/png",
    },
  ],
};

// Core metadata generation function (private implementation)
async function generateMetadataCore(
  locale: string,
  route: string,
  titleKey: string,
  isPublic: boolean,
  socialMediaImages?: {
    facebook?: string;
    instagram?: string;
    xTwitter?: string;
    pinterest?: string;
    tiktok?: string;
    threads?: string;
  }
): Promise<Metadata> {
  // Load translations using next-intl
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Extract page name from the key (e.g., 'metadata.home.title' -> 'home')
  const pageName = titleKey.split(".")[1] || "home";

  // Get translated content
  const title = t(`${pageName}.title`);
  const description = t(`${pageName}.description`);
  const keywords = t(`${pageName}.keywords`);

  // Determine proper language code
  const properLang = languageMap[locale] || locale;
  const languageAlternates = generateLanguageAlternates(route);
  const fullUrl = `${process.env.NEXTAUTH_URL}/${locale}${route}`;

  // Enhanced images for social media - prioritize platform-specific images
  const enhancedImages = socialMediaImages 
    ? [
        // Facebook image (1200x630 recommended)
        ...(socialMediaImages.facebook ? [{
          url: socialMediaImages.facebook,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.facebook.startsWith('https') ? socialMediaImages.facebook : undefined,
        }] : []),
        // Instagram image (1080x1080 recommended)
        ...(socialMediaImages.instagram ? [{
          url: socialMediaImages.instagram,
          width: 1080,
          height: 1080,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.instagram.startsWith('https') ? socialMediaImages.instagram : undefined,
        }] : []),
        // Pinterest image (1000x1500 recommended)
        ...(socialMediaImages.pinterest ? [{
          url: socialMediaImages.pinterest,
          width: 1000,
          height: 1500,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.pinterest.startsWith('https') ? socialMediaImages.pinterest : undefined,
        }] : []),
        // X/Twitter image (1200x675 recommended)
        ...(socialMediaImages.xTwitter ? [{
          url: socialMediaImages.xTwitter,
          width: 1200,
          height: 675,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.xTwitter.startsWith('https') ? socialMediaImages.xTwitter : undefined,
        }] : []),
        // TikTok image (1080x1920 recommended)
        ...(socialMediaImages.tiktok ? [{
          url: socialMediaImages.tiktok,
          width: 1080,
          height: 1920,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.tiktok.startsWith('https') ? socialMediaImages.tiktok : undefined,
        }] : []),
        // Threads image (1080x1080 recommended)
        ...(socialMediaImages.threads ? [{
          url: socialMediaImages.threads,
          width: 1080,
          height: 1080,
          alt: title,
          type: 'image/png',
          secureUrl: socialMediaImages.threads.startsWith('https') ? socialMediaImages.threads : undefined,
        }] : []),
      ]
    : baseMetadata.images.map((img) => ({
        ...img,
        secureUrl: img.url.startsWith("https") ? img.url : undefined,
      }));

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
    // Open Graph for Facebook, Pinterest, LinkedIn, WhatsApp, Instagram/Threads
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: baseMetadata.siteName,
      locale: properLang,
      type: "website",
      images: enhancedImages,
    },
    // Twitter Cards for better Twitter sharing
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: baseMetadata.images.map((img) => img.url),
      creator: "@womensspot", // Replace with your Twitter handle
      site: "@womensspot", // Replace with your Twitter handle
    },
    // Additional general metadata
    other: {
      language: locale,
      "pinterest:rich-pin": "true",
      "whatsapp:description": description,
      "theme-color": "#8B5CF6",
      "msapplication-TileColor": "#8B5CF6",
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": baseMetadata.siteName,
      "application-name": baseMetadata.siteName,
      "msapplication-config": "/browserconfig.xml",
      "format-detection": "telephone=no",
      author: baseMetadata.authors[0].name,
      copyright: `© ${new Date().getFullYear()} ${baseMetadata.siteName}. All rights reserved.`,
      distribution: "global",
      rating: "general",
      "revisit-after": "7 days",
    },
    verification: {
      // Add platform verification codes here if available
      // google, facebook, twitter, yandex, etc.
    },
  };
}

// Generate metadata for public pages (indexable)
export async function generatePublicMetadata(
  locale: string,
  route: string,
  titleKey: string,
  socialMediaImages?: {
    facebook?: string;
    instagram?: string;
    xTwitter?: string;
    pinterest?: string;
    tiktok?: string;
    threads?: string;
  }
): Promise<Metadata> {
  return generateMetadataCore(locale, route, titleKey, true, socialMediaImages);
}

// Generate metadata for private pages (noindex)
export async function generatePrivateMetadata(
  locale: string,
  route: string,
  titleKey: string,
  socialMediaImages?: {
    facebook?: string;
    instagram?: string;
    xTwitter?: string;
    pinterest?: string;
    tiktok?: string;
    threads?: string;
  }
): Promise<Metadata> {
  return generateMetadataCore(locale, route, titleKey, false, socialMediaImages);
}

// Convenience functions that accept social media data directly
export async function generatePublicMetadataWithSocialMedia(
  locale: string,
  route: string,
  titleKey: string,
  socialMedia?: ISocialMedia
): Promise<Metadata> {
  const socialMediaImages = extractSocialMediaImages(socialMedia);
  return generateMetadataCore(locale, route, titleKey, true, socialMediaImages);
}

export async function generatePrivateMetadataWithSocialMedia(
  locale: string,
  route: string,
  titleKey: string,
  socialMedia?: ISocialMedia
): Promise<Metadata> {
  const socialMediaImages = extractSocialMediaImages(socialMedia);
  return generateMetadataCore(locale, route, titleKey, false, socialMediaImages);
}
