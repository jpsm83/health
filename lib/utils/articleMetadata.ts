import { Metadata } from 'next';
import { IMetaDataArticle } from '@/types/article';
import { languageMap } from './genericMetadata';

// Generate comprehensive metadata for article pages
// Optimized for video prioritization on all major social media platforms
export async function generateArticleMetadata(
  metaContent: IMetaDataArticle
): Promise<Metadata> {
  
  // Enhanced image handling for social media
  const enhancedImages = metaContent.articleImages?.length > 0
    ? metaContent.articleImages.map((img: string) => ({
        url: img,
        width: 1024,
        height: 1024,
        alt: metaContent.seo.metaTitle || 'Article image',
        type: 'image/png',
        secureUrl: img.startsWith('https') ? img : undefined,
      }))
    : [{
        url: '/womens-spot.png',
        width: 1200,
        height: 630,
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
  
  // Video metadata object if video exists
  const videoMeta = metaContent.articleVideo ? {
    url: metaContent.articleVideo,
    secureUrl: metaContent.articleVideo.startsWith('https') ? metaContent.articleVideo : undefined,
    type: 'video/mp4',
    width: 720,
    height: 1280,
  } : undefined;

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
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Women\'s Spot',
      locale: properLang,
      type: videoMeta ? 'video.other' : 'article',
      // Video comes first to maximize priority
      videos: videoMeta ? [videoMeta] : undefined,
      // Only include images if no video (forces Pinterest to use video)
      images: videoMeta ? undefined : enhancedImages,
      publishedTime: metaContent.createdAt instanceof Date ? metaContent.createdAt.toISOString() : new Date().toISOString(),
      modifiedTime: metaContent.updatedAt instanceof Date ? metaContent.updatedAt.toISOString() : new Date().toISOString(),
      authors: [author],
      section: metaContent.category || 'Health',
      tags: metaContent.seo.keywords || ['health', 'women', 'wellness'],
    },
    // Twitter Cards for better Twitter sharing
    twitter: {
      card: 'summary_large_image', // Use summary card for better compatibility
      title,
      description,
      images: metaContent.articleImages?.length > 0 ? metaContent.articleImages : ['/womens-spot.png'],
      creator: author,
      site: '@womensspot', // Replace with your Twitter handle
    },
    // Additional general metadata
    other: {
      language: metaContent.seo.hreflang || properLang,
      'pinterest:rich-pin': 'true',
      'whatsapp:description': description,
      // Pinterest video support (when video exists) - these come first to prioritize video
      ...(videoMeta && {
        'og:video': videoMeta.url,
        'og:video:type': videoMeta.type,
        'og:video:width': videoMeta.width.toString(),
        'og:video:height': videoMeta.height.toString(),
        'og:video:secure_url': videoMeta.secureUrl,
        'pinterest:video': videoMeta.url,
        'pinterest:video:type': videoMeta.type,
        'pinterest:video:width': videoMeta.width.toString(),
        'pinterest:video:height': videoMeta.height.toString(),
      }),
      // Twitter video support (when video exists)
      ...(videoMeta && {
        'twitter:player': videoMeta.url,
        'twitter:player:width': videoMeta.width.toString(),
        'twitter:player:height': videoMeta.height.toString(),
        'twitter:player:stream': videoMeta.url,
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
