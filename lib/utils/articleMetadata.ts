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

  // Enhanced image handling for social media - prioritize platform-specific images
  const enhancedImages = socialMediaImages 
    ? [
        // Facebook image (1440x1800 recommended)
        ...(socialMediaImages.facebook ? [{
          url: socialMediaImages.facebook,
          width: 1440,
          height: 1800,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.facebook.startsWith('https') ? socialMediaImages.facebook : undefined,
        }] : []),
        // Instagram image (1080x1440 recommended)
        ...(socialMediaImages.instagram ? [{
          url: socialMediaImages.instagram,
          width: 1080,
          height: 1440,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.instagram.startsWith('https') ? socialMediaImages.instagram : undefined,
        }] : []),
        // Pinterest image (1000x1500 recommended)
        ...(socialMediaImages.pinterest ? [{
          url: socialMediaImages.pinterest,
          width: 1000,
          height: 1500,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.pinterest.startsWith('https') ? socialMediaImages.pinterest : undefined,
        }] : []),
        // X/Twitter image (1200x600 recommended)
        ...(socialMediaImages.xTwitter ? [{
          url: socialMediaImages.xTwitter,
          width: 1200,
          height: 600,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.xTwitter.startsWith('https') ? socialMediaImages.xTwitter : undefined,
        }] : []),
        // TikTok image (1080x1920 recommended)
        ...(socialMediaImages.tiktok ? [{
          url: socialMediaImages.tiktok,
          width: 1080,
          height: 1920,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.tiktok.startsWith('https') ? socialMediaImages.tiktok : undefined,
        }] : []),
        // Threads image (1080x1920 recommended)
        ...(socialMediaImages.threads ? [{
          url: socialMediaImages.threads,
          width: 1080,
          height: 1080,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: socialMediaImages.threads.startsWith('https') ? socialMediaImages.threads : undefined,
        }] : []),
      ]
    : metaContent.articleImages?.length > 0
      ? metaContent.articleImages.map((img: string) => ({
          url: img,
          width: 1024,
          height: 1024,
          alt: metaContent.seo.metaTitle || 'Article image',
          type: 'image/png',
          secureUrl: img.startsWith('https') ? img : undefined,
        }))
      : [{
          url: 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
          width: 1792,
          height: 1024,
          alt: 'Women\'s Spot - Empowering Women',
          type: 'image/png',
        }];

  // Determine proper language code
  const properLang = languageMap[metaContent.seo.hreflang] || metaContent.seo.hreflang || 'en-US';

  // Ensure valid metadata values with better fallbacks
  const title = metaContent.seo.metaTitle || `Health Article - Women's Spot`;
  const description = metaContent.seo.metaDescription || `Discover valuable health insights and wellness tips on Women's Spot. Expert advice for women's health and wellness.`;
  const keywords = metaContent.seo.keywords?.length > 0 ? metaContent.seo.keywords.join(', ') : 'health, women, wellness, fitness, nutrition, mental health, lifestyle';
  const canonicalUrl = metaContent.seo.canonicalUrl || `${process.env.NEXTAUTH_URL}`;
  const author = metaContent.createdBy || 'Women\'s Spot Team';
  

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
      
      // Image optimization for different platforms
      images: socialMediaImages?.facebook ? [
        // Facebook-optimized image (1440x1800 recommended)
        {
          url: socialMediaImages.facebook,
          width: 1440,
          height: 1800,
          alt: title,
          type: 'image/jpeg',
        }
      ] : socialMediaImages?.instagram ? [
        // Instagram-optimized image (1080x1080 or 1080x1350)
        {
          url: socialMediaImages.instagram,
          width: 1080,
          height: 1080,
          alt: title,
          type: 'image/jpeg',
        }
      ] : enhancedImages,
      
      // Pinterest-specific Open Graph enhancements
      ...(socialMediaImages?.pinterest && {
        images: [
          {
            url: socialMediaImages.pinterest,
            width: 1000,
            height: 1500,
            alt: title,
            type: 'image/jpeg',
          }
        ]
      }),
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
      creator: author,
      // Title (max 70 characters) - falls back to og:title
      title: title.length > 70 ? title.substring(0, 67) + '...' : title,
      // Description (max 200 characters) - falls back to og:description
      description: description.length > 200 ? description.substring(0, 197) + '...' : description,
      // Image URL - falls back to og:image
      images: socialMediaImages?.xTwitter ? [socialMediaImages.xTwitter] : (metaContent.articleImages?.length > 0 ? metaContent.articleImages : ['/womens-spot.png']),
    },

    // Additional general metadata
    other: {
      language: metaContent.seo.hreflang || properLang,
      'pinterest:rich-pin': 'true',
      'whatsapp:description': description,

      // ========================================
      // FACEBOOK SPECIFIC METADATA
      // ========================================
      ...(socialMediaImages?.facebook && {
        'fb:app_id': process.env.FACEBOOK_APP_ID || '', // Add your Facebook App ID
        'fb:pages': process.env.FACEBOOK_PAGE_ID || '',
      }),
      
      // ========================================
      // INSTAGRAM SPECIFIC METADATA
      // ========================================
      // Instagram uses Open Graph tags for Stories and DMs
      ...(socialMediaImages?.instagram && {
        'instagram:app_id': process.env.INSTAGRAM_APP_ID || '', // Add your Instagram App ID
      }),
      
      // ========================================
      // THREADS SPECIFIC METADATA
      // ========================================
      // Threads uses the same Open Graph tags as Facebook
      // No additional metadata needed - uses standard Open Graph
      ...(socialMediaImages?.pinterest && {
        'pinterest:image': socialMediaImages.pinterest,
        'pinterest:image:width': '1000',
        'pinterest:image:height': '1500',
        'pinterest:image:type': 'image/jpeg',
        'pinterest:image:alt': title,
      }),

      // ========================================
      // X (TWITTER) SPECIFIC METADATA
      // ========================================

      ...(socialMediaImages?.xTwitter && {
        'twitter:image': socialMediaImages.xTwitter,
        'twitter:image:width': '1200',
        'twitter:image:height': '600',
        'twitter:image:alt': title.length > 420 ? title.substring(0, 417) + '...' : title,
      }),
      ...(socialMediaImages?.tiktok && {
        'tiktok:image': socialMediaImages.tiktok,
        'tiktok:image:width': '1080',
        'tiktok:image:height': '1920',
      }),
      ...(socialMediaImages?.threads && {
        'threads:image': socialMediaImages.threads,
        'threads:image:width': '1080',
        'threads:image:height': '1920',
      }),
      'theme-color': '#8B5CF6',
      'msapplication-TileColor': '#8B5CF6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Women\'s Spot',
      'application-name': 'Women\'s Spot',
      'msapplication-config': '/browserconfig.xml',
      'format-detection': 'telephone=no',
      author: 'Women\'s Spot Team',
      copyright: `© ${new Date().getFullYear()} Women\'s Spot. All rights reserved.`,
      distribution: 'global',
      rating: 'general',
      'revisit-after': '7 days',

      // ========================================
      // COMPREHENSIVE OPEN GRAPH METADATA
      // ========================================
      // Core Open Graph properties for Facebook, Instagram, Threads, Pinterest
      'og:type': 'article',
      'og:site_name': 'Women\'s Spot',
      'og:locale': properLang,
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'og:image': socialMediaImages?.facebook || socialMediaImages?.instagram || socialMediaImages?.pinterest || metaContent.articleImages?.[0] || '/womens-spot.png',
      'og:image:width': socialMediaImages?.facebook ? '1440' : socialMediaImages?.instagram ? '1080' : socialMediaImages?.pinterest ? '1000' : '1200',
      'og:image:height': socialMediaImages?.facebook ? '1800' : socialMediaImages?.instagram ? '1080' : socialMediaImages?.pinterest ? '1500' : '630',
      'og:image:type': 'image/jpeg',
      'og:image:alt': title,
      
      // Article-specific Open Graph properties
      'article:author': author,
      'article:section': metaContent.category || 'Health',
      'article:tag': metaContent.seo.keywords?.join(',') || 'health, women, wellness',
      'article:published_time': metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
      'article:modified_time': metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      
      // Additional Open Graph properties for better sharing
      'og:updated_time': metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      'og:see_also': canonicalUrl,
      // Additional meta tags for better SEO
      'referrer': 'origin-when-cross-origin',
      'color-scheme': 'light dark',
      'supported-color-schemes': 'light dark',

      // ========================================
      // PINTEREST RICH PINS METADATA
      // ========================================

      'pinterest:title': title,
      'pinterest:description': description,
      'pinterest:author': author,
      'pinterest:section': metaContent.category || 'Health',
      'pinterest:tags': metaContent.seo.keywords?.join(',') || 'health, women, wellness',
      'pinterest:published_time': metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
      'pinterest:modified_time': metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      
      // ========================================
      // X (TWITTER) ADDITIONAL METADATA
      // ========================================
      // Note: Main Twitter metadata is handled in the Next.js twitter object above
      // These are additional Twitter-specific meta tags for enhanced sharing
      'twitter:image:alt': title.length > 420 ? title.substring(0, 417) + '...' : title,
      
      // Schema.org structured data for Pinterest Rich Pins
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": socialMediaImages?.pinterest || metaContent.articleImages?.[0] || 'https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png',
        "author": {
          "@type": "Person",
          "name": author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Women's Spot",
          "logo": {
            "@type": "ImageObject",
            "url": "https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png"
          }
        },
        "datePublished": metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
        "dateModified": metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "articleSection": metaContent.category || 'Health',
        "keywords": metaContent.seo.keywords?.join(',') || 'health, women, wellness',
        "url": canonicalUrl,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Women's Spot",
          "url": process.env.NEXTAUTH_URL || "https://womensspot.com"
        }
      })
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
