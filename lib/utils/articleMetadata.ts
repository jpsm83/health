import { Metadata } from 'next';
import { IMetaDataArticle } from '@/types/article';
import { languageMap } from './genericMetadata';

// Helper function to extract social media images from article data
// Now uses the single postImage from languageSpecificSchema
export function extractSocialMediaImages(postImage?: string): {
  facebook?: string;
  instagram?: string;
  xTwitter?: string;
  pinterest?: string;
  tiktok?: string;
  threads?: string;
} | undefined {
  if (!postImage) return undefined;
  
  // All social media platforms now use the same postImage
  return {
    facebook: postImage,
    instagram: postImage,
    xTwitter: postImage,
    pinterest: postImage,
    tiktok: postImage,
    threads: postImage,
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
      // Pinterest Article Rich Pins compliance
      publishedTime: new Date().toISOString(),
      modifiedTime: new Date().toISOString(),
      authors: ["Women's Spot Team"],
      section: category || 'Health',
      tags: ['health', 'women', 'wellness'],
    },
    twitter: {
      card: 'summary_large_image', // Required: Card type
      site: '@womensspot', // Required: Website Twitter handle
      creator: '@womensspot', // Required: Content creator Twitter handle
      title: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Health'} Article - Women's Spot`, // Required: Title (max 70 chars)
      description: `Discover valuable health insights and wellness tips on Women's Spot.`, // Required: Description (max 200 chars)
      images: ['https://res.cloudinary.com/jpsm83/image/upload/v1760114436/health/xgy4rvnd9egnwzlvsfku.png'], // Required: Image URL
      // Note: image and imageAlt are handled via the 'other' metadata section
    },
  };
}

// Generate comprehensive metadata for article pages
// Optimized for video prioritization on all major social media platforms
export async function generateArticleMetadata(
  metaContent: IMetaDataArticle
): Promise<Metadata> {
  
  // Extract social media specific postImages from the language-specific postImage
  // Note: This assumes we're getting the postImage from the current language's data
  const socialMediaImages = extractSocialMediaImages(metaContent.postImage);

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

  // Ensure valid metadata values
  const title = metaContent.seo.metaTitle || 'Article';
  const description = metaContent.seo.metaDescription || 'Read this article on Women\'s Spot';
  const keywords = metaContent.seo.keywords?.length > 0 ? metaContent.seo.keywords.join(', ') : 'health, women, wellness';
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
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [properLang]: canonicalUrl,
      },
    },
    // Open Graph for Facebook, Pinterest, LinkedIn, WhatsApp, Instagram/Threads
    // Optimized for Pinterest Article Rich Pins compliance
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Women\'s Spot',
      locale: properLang,
      type: 'article',
      images: enhancedImages,
      // Pinterest Article Rich Pins required fields
      publishedTime: metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
      modifiedTime: metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      authors: [author],
      section: metaContent.category || 'Health',
      tags: metaContent.seo.keywords || ['health', 'women', 'wellness'],
      // Additional Pinterest-specific fields for better Rich Pin display
      // Note: These fields are already included above in the main openGraph object
    },
    // Twitter Cards for better Twitter sharing
    // Optimized for Twitter Card validation and automatic detection
    twitter: {
      card: 'summary_large_image', // Required: Card type for articles
      title, // Required: Article title (max 70 characters)
      description, // Required: Article description (max 200 characters)
      images: socialMediaImages?.xTwitter ? [socialMediaImages.xTwitter] : (metaContent.articleImages?.length > 0 ? metaContent.articleImages : ['/womens-spot.png']),
      creator: '@womensspot', // Required: Content creator's Twitter handle
      site: '@womensspot', // Required: Website's Twitter handle
      // Additional Twitter Card metadata for better validation
      // Note: image and imageAlt are handled via the 'other' metadata section below
    },
    // Additional general metadata
    other: {
      language: metaContent.seo.hreflang || properLang,
      // Pinterest Article Rich Pins specific metadata
      'pinterest:rich-pin': 'true',
      'pinterest:media': socialMediaImages?.pinterest || enhancedImages[0]?.url,
      'pinterest:description': description,
      'pinterest:title': title,
      'pinterest:author': author,
      'pinterest:section': metaContent.category || 'Health',
      'pinterest:tags': metaContent.seo.keywords?.join(',') || 'health, women, wellness',
      'whatsapp:description': description,
      // Platform-specific image metadata
      ...(socialMediaImages?.facebook && {
        'og:image': socialMediaImages.facebook,
        'og:image:width': '1440',
        'og:image:height': '1800',
        'og:image:type': 'image/png',
      }),
      ...(socialMediaImages?.instagram && {
        'og:image:instagram': socialMediaImages.instagram,
      }),
      ...(socialMediaImages?.pinterest && {
        'pinterest:image': socialMediaImages.pinterest,
        'pinterest:image:width': '1000',
        'pinterest:image:height': '1500',
        'pinterest:image:type': 'image/png',
        'pinterest:image:alt': metaContent.seo.metaTitle || 'Article image',
      }),
      ...(socialMediaImages?.xTwitter && {
        'twitter:image': socialMediaImages.xTwitter,
        'twitter:image:width': '1200',
        'twitter:image:height': '675', // Twitter's recommended 16:9 aspect ratio
        'twitter:image:alt': metaContent.seo.metaTitle || 'Article image',
      }),
      // Additional Twitter Card validation metadata
      'twitter:card': 'summary_large_image',
      'twitter:site': '@womensspot',
      'twitter:creator': '@womensspot',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': socialMediaImages?.xTwitter || (metaContent.articleImages?.length > 0 ? metaContent.articleImages[0] : '/womens-spot.png'),
      'twitter:image:alt': metaContent.seo.metaTitle || 'Article image',
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
