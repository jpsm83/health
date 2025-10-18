import { Metadata } from 'next';
import { IMetaDataArticle } from '@/types/article';
import { languageMap } from './genericMetadata';

// Simple fallback metadata that doesn't require database access
export function generateSimpleFallbackMetadata(slug: string, locale: string, category?: string): Metadata {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://womensspot.com';

  const canonicalUrl = `${baseUrl}/${locale}/${category || 'health'}/${slug}`;

  return {
    title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Health'} Article - Women's Spot`,
    description: `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`,
    keywords: 'health, women, wellness, fitness, nutrition, mental health, lifestyle',
    authors: [{ name: "Women's Spot Team" }],
    creator: "Women's Spot Team",
    publisher: "Women's Spot",
    metadataBase: new URL(baseUrl),
    robots: 'index, follow',
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `Women's Spot | ${category ? category : 'Health'} Article`,
      description: `Discover valuable health insights and wellness tips on Women's Spot.`,
      url: canonicalUrl,
      siteName: "Women's Spot",
      type: 'article',
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      authors: ["Women's Spot Team"],
      section: category || 'Health',
      tags: ['health', 'women', 'wellness', 'fitness', 'nutrition', 'mental health', 'lifestyle'],
      images: [
        {
          url: 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
          width: 1200,
          height: 630,
          alt: "Women's Spot - Empowering Women",
        },
      ],
    },
    twitter: {
      card: 'summary',
      site: '@womensspot',
      creator: '@womensspot',
      title: `Women's Spot | ${category ? category : 'Health'} Article`,
      description: `Discover valuable health insights and wellness tips on Women's Spot.`,
      images: ['https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png'],
    },
  };
}

// Generate dynamic metadata for an article page
// Supports OpenGraph, Twitter Cards, Pinterest Rich Pins, etc.
export async function generateArticleMetadata(metaContent: IMetaDataArticle): Promise<Metadata> {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';

  // Language
  const properLang = languageMap[metaContent.seo.hreflang] || metaContent.seo.hreflang || 'en-US';

  // Core meta values
  const title = metaContent.seo.metaTitle || 'Article - Women\'s Spot';
  const description = metaContent.seo.metaDescription || 'Read this article on Women\'s Spot';
  const keywords = metaContent.seo.keywords?.length ? metaContent.seo.keywords.join(', ') : 'health, women, wellness';
  const canonicalUrl = metaContent.seo.canonicalUrl || `${baseUrl}/${metaContent.slug}`;
  const author = metaContent.createdBy || "Women's Spot Team";

  // Main image (use the same for all social networks)
  const imageUrl =
    metaContent.postImage ||
    'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png';

  // Publication dates
  const publishedAt =
    metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString();
  const updatedAt =
    metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString();

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    metadataBase: new URL(baseUrl),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: canonicalUrl,
      languages: { [properLang]: canonicalUrl },
    },

    // OPEN GRAPH — Used by Facebook, Pinterest, LinkedIn, WhatsApp
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Women's Spot",
      locale: properLang,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [author],
      section: metaContent.category || 'Health',
      tags: metaContent.seo.keywords || ['health', 'women', 'wellness'],
      images: [
        {
          url: imageUrl,
          width: 1080,
          height: 1440,
          alt: title,
        },
      ],
    },

    // TWITTER CARD — Used by Twitter/X
    twitter: {
      card: 'summary',
      site: '@womensspot',
      creator: '@womensspot',
      title,
      description,
      images: [imageUrl],
    },

    // OTHER METADATA — Includes Pinterest Rich Pins and SEO extensions
    other: {
      // Pinterest Rich Pin support
      'pinterest:rich-pin': 'true',
      'pinterest:media': imageUrl,
      'pinterest:description': description,
      'pinterest:title': title,
      'pinterest:author': author,
      'pinterest:section': metaContent.category || 'Health',
      'pinterest:tags': keywords,

      // Open Graph extensions
      'article:author': author,
      'article:published_time': publishedAt,
      'article:modified_time': updatedAt,
      'article:section': metaContent.category || 'Health',
      'article:tag': keywords,

      // General SEO enhancements
      'theme-color': '#8B5CF6',
      'msapplication-TileColor': '#8B5CF6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Women\'s Spot',
      'application-name': 'Women\'s Spot',
      'format-detection': 'telephone=no',
      author: 'Women\'s Spot Team',
      copyright: `© ${new Date().getFullYear()} Women's Spot. All rights reserved.`,
      distribution: 'global',
      rating: 'general',
      'revisit-after': '7 days',
    },

    verification: {
      // You can add Google / Pinterest / Facebook verification tags here
    },
  };
}

/**
 * Fallback metadata when article not found
 */
export function generateArticleNotFoundMetadata(): Metadata {
  return {
    title: 'Article Not Found',
    description: 'The requested article could not be found.',
    robots: 'noindex, nofollow',
  };
}
