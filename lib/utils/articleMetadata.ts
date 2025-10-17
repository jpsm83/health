import { Metadata } from 'next';
import { IMetaDataArticle, ISocialMedia } from '@/types/article';
import { languageMap } from './genericMetadata';

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

// Generate comprehensive metadata for article pages
// Optimized for video prioritization on all major social media platforms
export async function generateArticleMetadata(
  metaContent: IMetaDataArticle
): Promise<Metadata> {
  
  // Extract social media specific postImages
  const socialMediaImages = extractSocialMediaImages(metaContent.socialMedia);

  // Determine proper language code
  const properLang = languageMap[metaContent.seo.hreflang] || metaContent.seo.hreflang || 'en-US';

  // Ensure valid metadata values with better fallbacks
  const title = metaContent.seo.metaTitle || `Health Article - Women's Spot`;
  const description = metaContent.seo.metaDescription || `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`;
  const keywords = metaContent.seo.keywords?.length > 0 ? metaContent.seo.keywords.join(', ') : 'health, women, wellness, fitness, nutrition, mental health, lifestyle';
  
  // Better environment variable handling for production
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';
  const canonicalUrl = metaContent.seo.canonicalUrl || baseUrl;
  const author = metaContent.createdBy || 'Women\'s Spot Team';

  // Build a single images array for Open Graph (don't overwrite)
  const ogImages = [];
  
  // Add platform-specific images in order of preference
  if (socialMediaImages?.facebook) {
    ogImages.push({
      url: socialMediaImages.facebook,
      width: 1200,
      height: 630, // Standard OG ratio
      alt: title,
      type: 'image/jpeg',
    });
  }
  
  if (socialMediaImages?.instagram) {
    ogImages.push({
      url: socialMediaImages.instagram,
      width: 1080,
      height: 1080,
      alt: title,
      type: 'image/jpeg',
    });
  }
  
  if (socialMediaImages?.pinterest) {
    ogImages.push({
      url: socialMediaImages.pinterest,
      width: 1000,
      height: 1500,
      alt: title,
      type: 'image/jpeg',
    });
  }
  
  if (socialMediaImages?.xTwitter) {
    ogImages.push({
      url: socialMediaImages.xTwitter,
      width: 1200,
      height: 630,
      alt: title,
      type: 'image/jpeg',
    });
  }
  
  // Add article images as fallback
  if (metaContent.articleImages?.length > 0) {
    metaContent.articleImages.forEach((img: string) => {
      ogImages.push({
        url: img,
        width: 1200,
        height: 630,
        alt: title,
        type: 'image/jpeg',
      });
    });
  }
  
  // Final fallback
  if (ogImages.length === 0) {
    ogImages.push({
      url: 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
      width: 1200,
      height: 630,
      alt: title,
      type: 'image/jpeg',
    });
  }
  

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
      languages: {
        [properLang]: canonicalUrl,
      },
    },

    // ========================================
    // OPEN GRAPH METADATA (FACEBOOK, INSTAGRAM, THREADS)
    // ========================================

    // Used by: Facebook, Instagram Stories/DMs, Threads, Messenger, LinkedIn, WhatsApp
    // Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
    openGraph: {
      // Basic Open Graph properties
      title: title,
      description: description,
      url: canonicalUrl,
      siteName: 'Women\'s Spot',
      locale: properLang,
      type: 'article',
      
      // Article-specific properties
      publishedTime: metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
      modifiedTime: metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      authors: [author],
      section: metaContent.category || 'Health',
      tags: metaContent.seo.keywords || ['health', 'women', 'wellness'],
      
      // Use the single images array we built
      images: ogImages,
    },

    // ========================================
    // X (TWITTER) CARDS METADATA
    // ========================================

    // Based on: https://developer.x.com/en/docs/x-for-websites/cards/overview/markup
    twitter: {
      // Required: Card type - summary_large_image for articles
      card: 'summary_large_image',
      // Required: Site username (either site or site:id required)
      site: '@womensspot',
      // Optional: Creator username for content attribution
      creator: '@womensspot',
      // Title (max 70 characters) - falls back to og:title
      title: title.length > 70 ? title.substring(0, 67) + '...' : title,
      // Description (max 200 characters) - falls back to og:description
      description: description.length > 200 ? description.substring(0, 197) + '...' : description,
      // Image URL - use first image from our array
      images: ogImages.length > 0 ? [ogImages[0].url] : ['https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png'],
    },

    // Essential metadata only (other fields don't generate meta tags)
    other: {
      'theme-color': '#8B5CF6',
      'msapplication-TileColor': '#8B5CF6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Women\'s Spot',
      'application-name': 'Women\'s Spot',
      'format-detection': 'telephone=no',
    },
    verification: {
      // Add platform verification codes here if available
      // google, facebook, twitter, yandex, etc.
    },
  };
}

// Fallback metadata when article not found
export function generateArticleNotFoundMetadata(): Metadata {
  return {
    title: 'Article Not Found',
    description: 'The requested article could not be found.',
    robots: 'noindex, nofollow',
  };
}

// Simple fallback metadata that doesn't require database access
export function generateSimpleFallbackMetadata(slug: string, locale: string, category?: string): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://womensspot.com';
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
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Health'} Article - Women's Spot`,
      description: `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`,
      url: canonicalUrl,
      siteName: 'Women\'s Spot',
      type: 'article',
      images: [{
        url: 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
        width: 1792,
        height: 1024,
        alt: 'Women\'s Spot - Empowering Women',
        type: 'image/png',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@womensspot',
      creator: '@womensspot',
      title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Health'} Article - Women's Spot`,
      description: `Discover valuable health insights and wellness tips on Women's Spot.`,
      images: ['https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png'],
    },
  };
}
