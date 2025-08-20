import { Metadata } from 'next';
import { IContentsByLanguage } from '@/interfaces/article';
import connectDb from '@/app/api/db/connectDb';
import Article from '@/app/api/models/article';

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

// Interface for article data needed for metadata
interface ArticleMetadataData {
  contentsByLanguage: IContentsByLanguage[];
  articleImages: string[];
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for content data needed for metadata
interface ContentMetadataData {
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
    hreflang: string;
    canonicalUrl: string;
  };
}

/**
 * Generate comprehensive metadata for article pages from slug
 * This function handles everything: data fetching, validation, and metadata generation
 */
export async function generateArticleMetadataFromSlug(
  locale: string,
  slug: string
): Promise<Metadata> {
  try {
    await connectDb();
    
    // Find article by slug in the current language
    const article = await Article.findOne({
      "contentsByLanguage.seo.slug": slug,
      "contentsByLanguage.seo.hreflang": locale
    });
    
    if (!article) {
      return generateArticleNotFoundMetadata();
    }
    
    // Get the content for the current language
    const content = article.contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.hreflang === locale
    );
    
    if (!content) {
      return generateArticleNotFoundMetadata();
    }
    
    // Generate comprehensive metadata
    return generateArticleMetadata(locale, article, content);
    
  } catch (error) {
    console.error('Error fetching article for metadata:', error);
    return generateArticleNotFoundMetadata();
  }
}

/**
 * Generate comprehensive metadata for article pages
 * Optimized for all major social media platforms
 */
export async function generateArticleMetadata(
  locale: string,
  article: ArticleMetadataData,
  content: ContentMetadataData
): Promise<Metadata> {
  // Build proper multilingual alternates
  const languageAlternates: Record<string, string> = {};
  article.contentsByLanguage.forEach((langContent: IContentsByLanguage) => {
    const properLang = languageMap[langContent.seo.hreflang] || langContent.seo.hreflang;
    languageAlternates[properLang] = langContent.seo.canonicalUrl;
  });
  
  // Enhanced image handling for social media
  const enhancedImages = article.articleImages.map((img: string) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: content.seo.metaTitle,
    type: 'image/jpeg', // or 'image/png' depending on your image format
    secureUrl: img.startsWith('https') ? img : undefined,
  }));
  
  // Get proper language code for current locale
  const properLang = languageMap[locale] || locale;
  
  return {
    title: content.seo.metaTitle,
    description: content.seo.metaDescription,
    keywords: content.seo.keywords.join(', '),
    authors: [{ name: 'Women Spot Team' }],
    creator: 'Women Spot',
    publisher: 'Women Spot',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: content.seo.canonicalUrl,
      languages: languageAlternates,
    },
    // Enhanced Open Graph for Facebook, LinkedIn, WhatsApp, Discord, etc.
    openGraph: {
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      url: content.seo.canonicalUrl,
      siteName: 'Women Spot',
      locale: properLang,
      type: 'article',
      // Enhanced image handling for better social media display
      images: enhancedImages,
    },
    // Enhanced Twitter Cards for better Twitter sharing
    twitter: {
      card: 'summary_large_image',
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      images: article.articleImages,
      // Additional Twitter properties
      creator: '@womenspot', // Add your actual Twitter handle
      site: '@womenspot', // Add your actual Twitter handle
    },
    // Additional metadata for other platforms and SEO
    other: {
      'language': locale,
      // Article-specific metadata
      'article:published_time': article.createdAt?.toISOString() || '',
      'article:modified_time': article.updatedAt?.toISOString() || '',
      'article:author': 'Women Spot',
      'article:section': article.category,
      'article:tag': content.seo.keywords.join(', '),
      // LinkedIn specific
      'linkedin:owner': 'womenspot', // Add your actual LinkedIn company page
      // Pinterest specific
      'pinterest:rich-pin': 'true',
      // WhatsApp specific
      'whatsapp:description': content.seo.metaDescription,
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

/**
 * Generate fallback metadata for when article is not found
 */
export function generateArticleNotFoundMetadata(): Metadata {
  return {
    title: 'Article Not Found',
    description: 'The requested article could not be found.',
    robots: 'noindex, nofollow',
  };
}
