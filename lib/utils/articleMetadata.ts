import { Metadata } from 'next';
import { IMetaDataArticle } from '@/interfaces/article';

// Language mapping for proper hreflang values (matching metadata.ts)
const languageMap: Record<string, string> = {
  'en': 'en-US',
  'pt': 'pt-BR', 
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'it': 'it-IT',
  'nl': 'nl-NL',
  'he': 'he-IL',
  'ru': 'ru-RU'
};

// Generate comprehensive metadata for article pages
// Optimized for all major social media platforms
export async function generateArticleMetadata(
  metaContent: IMetaDataArticle
): Promise<Metadata> {
  
  // Enhanced image handling for social media
  const enhancedImages = metaContent.articleImages.map((img: string) => ({
    url: img,
    width: 1280,
    height: 720,
    alt: metaContent.seo.metaTitle,
    type: 'image/png', // or 'image/png' depending on your image format
    secureUrl: img.startsWith('https') ? img : undefined,
  }));
  
  // Get proper language code for current locale
  const properLang = languageMap[metaContent.seo.hreflang]
  
  return {
    title: metaContent.seo.metaTitle,
    description: metaContent.seo.metaDescription,
    keywords: metaContent.seo.keywords.join(', '),
    authors: [{ name: metaContent.createdBy }],
    creator: metaContent.createdBy,
    publisher: metaContent.createdBy,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: metaContent.seo.canonicalUrl,
      languages: {
        [properLang]: metaContent.seo.canonicalUrl,
      },
    },
    // Enhanced Open Graph for Facebook, LinkedIn, WhatsApp, Discord, etc.
    openGraph: {
      title: metaContent.seo.metaTitle,
      description: metaContent.seo.metaDescription,
      url: metaContent.seo.canonicalUrl,
      siteName: 'Women Spot',
      locale: properLang,
      type: 'article',
      // Enhanced image handling for better social media display
      images: enhancedImages,
    },
    // Enhanced Twitter Cards for better Twitter sharing
    twitter: {
      card: 'summary_large_image',
      title: metaContent.seo.metaTitle,
      description: metaContent.seo.metaDescription,
      images: metaContent.articleImages,
      // Additional Twitter properties
      creator: metaContent.createdBy, // Add your actual Twitter handle
      site: '@womenspot', // Add your actual Twitter handle
    },
    // Additional metadata for other platforms and SEO
    other: {
      'language': metaContent.seo.hreflang,
      // Article-specific metadata
      'article:published_time': metaContent.createdAt?.toISOString() || '',
      'article:modified_time': metaContent.updatedAt?.toISOString() || '',
      'article:author': 'Women Spot',
      'article:section': metaContent.category,
      'article:tag': metaContent.seo.keywords.join(', '),
      // LinkedIn specific
      'linkedin:owner': 'womenspot', // Add your actual LinkedIn company page
      // Pinterest specific
      'pinterest:rich-pin': 'true',
      // WhatsApp specific
      'whatsapp:description': metaContent.seo.metaDescription,
      // General social media
      'theme-color': '#8B5CF6', // Purple color from your brand
      'msapplication-TileColor': '#8B5CF6',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Women Spot',
      // Modern mobile web app support
      'application-name': 'Women Spot',
      'msapplication-config': '/browserconfig.xml',
      'format-detection': 'telephone=no',
      // Additional SEO
      'author': 'Women Spot Team',
      'copyright': `© ${new Date().getFullYear()} Women Spot. All rights reserved.`,
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
