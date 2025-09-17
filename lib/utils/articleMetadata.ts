import { Metadata } from 'next';
import { IMetaDataArticle } from '@/types/article';
import { languageMap } from './genericMetadata';

// Generate comprehensive metadata for article pages
// Optimized for all major social media platforms
export async function generateArticleMetadata(
  metaContent: IMetaDataArticle
): Promise<Metadata> {
  
  // Enhanced image handling for social media
  const enhancedImages = metaContent.articleImages?.length > 0 
    ? metaContent.articleImages.map((img: string) => ({
        url: img,
        width: 1280,
        height: 720,
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
  
  // Get proper language code for current locale
  const properLang = languageMap[metaContent.seo.hreflang] || metaContent.seo.hreflang || 'en-US';
  
  // Ensure we have valid values for all metadata fields
  const title = metaContent.seo.metaTitle || 'Article';
  const description = metaContent.seo.metaDescription || 'Read this article on Women\'s Spot';
  const keywords = metaContent.seo.keywords?.length > 0 ? metaContent.seo.keywords.join(', ') : 'health, women, wellness';
  const canonicalUrl = metaContent.seo.canonicalUrl || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`;
  const author = metaContent.createdBy || 'Women\'s Spot Team';

  return {
    title,
    description,
    keywords,
    authors: [{ name: author }],
    creator: author,
    publisher: author,
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        [properLang]: canonicalUrl,
      },
    },
    // Enhanced Open Graph for Facebook, LinkedIn, WhatsApp, Discord, etc.
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Women\'s Spot',
      locale: properLang,
      type: 'article',
      // Enhanced image handling for better social media display
      images: enhancedImages,
    },
    // Enhanced Twitter Cards for better Twitter sharing
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: metaContent.articleImages?.length > 0 ? metaContent.articleImages : ['/womens-spot.png'],
      // Additional Twitter properties
      creator: author,
      site: '@womensspot', // Add your actual Twitter handle
    },
    // Additional metadata for other platforms and SEO
    other: {
      'language': metaContent.seo.hreflang || properLang,
      // Article-specific metadata
      'article:published_time': (metaContent.createdAt instanceof Date ? metaContent.createdAt : new Date()).toISOString(),
      'article:modified_time': (metaContent.updatedAt instanceof Date ? metaContent.updatedAt : new Date()).toISOString(),
      'article:author': author,
      'article:section': metaContent.category || 'Health',
      'article:tag': keywords,
      // LinkedIn specific
      'linkedin:owner': 'womensspot', // Add your actual LinkedIn company page
      // Pinterest specific
      'pinterest:rich-pin': 'true',
      // WhatsApp specific
      'whatsapp:description': description,
      // General social media
      'theme-color': '#8B5CF6', // Purple color from your brand
      'msapplication-TileColor': '#8B5CF6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Women\'s Spot',
      // Modern mobile web app support
      'application-name': 'Women\'s Spot',
      'msapplication-config': '/browserconfig.xml',
      'format-detection': 'telephone=no',
      // Additional SEO
      'author': 'Women\'s Spot Team',
      'copyright': `© ${new Date().getFullYear()} Women\'s Spot. All rights reserved.`,
      'distribution': 'global',
      'rating': 'general',
      'revisit-after': '7 days',
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

// Generate fallback metadata for when article is not found
export function generateArticleNotFoundMetadata(): Metadata {
  return {
    title: 'Article Not Found',
    description: 'The requested article could not be found.',
    robots: 'noindex, nofollow',
  };
}
