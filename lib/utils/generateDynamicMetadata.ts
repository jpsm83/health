// This is a Next.js metadata generator that creates dynamic, SEO-optimized metadata for your health articles. Here's what it does:

// Purpose
// This function automatically generates complete SEO metadata for each article page, including titles, descriptions, Open Graph tags, Twitter cards, and structured data - all tailored to the specific language and content.

// How It Works
// Step 1: Language Validation
// Checks if the requested language is supported
// Returns error metadata if language is invalid

// Step 2: Article Lookup
// Finds the article by slug across all languages
// Ensures the article exists

// Step 3: Language-Specific Content
// Extracts content for the specific requested language
// Handles cases where content isn't available in that language

// Step 4: Metadata Assembly
// Combines all SEO data into Next.js Metadata format
// Generates alternate language URLs for hreflang
// Creates structured data for search engines

// Why It's Important
// This file is crucial for SEO success because it:
// Automates metadata generation - no manual work needed
// Ensures consistency across all articles and languages
// Optimizes social sharing with proper Open Graph tags
// Improves search rankings with structured data
// Handles multilingual SEO with proper hreflang tags
// Scales automatically as you add more articles

// Integration with Your App
// This function is typically used in your article page components
// It's essentially the SEO automation engine that makes every article page search-engine and social-media friendly! 

import { Metadata } from "next";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { 
  generateAlternateUrls, 
  generateArticleStructuredData,
  isSupportedLocale,
  SupportedLocale 
} from "@/lib/utils/languageUtils";

export async function generateDynamicMetadata({ 
  params
}: { 
  params: { lang: string, slug: string }
}): Promise<Metadata> {
  const { lang, slug } = params;
  
  try {
    // Connect to database
    await connectDb();
    
    // Validate locale
    if (!isSupportedLocale(lang)) {
      return {
        title: 'Invalid Language',
        description: 'The requested language is not supported.'
      };
    }
    
    // Fetch the article by slug (since slug should be unique across languages)
    const article = await Article.findOne({
      'contentsByLanguage.seo.slug': slug
    });
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      };
    }

    // Find the content for the specific language using hreflang
    const contentForLang = article.contentsByLanguage.find(
      (c: { seo: { hreflang: string } }) => c.seo.hreflang === lang
    );
    
    if (!contentForLang) {
      return {
        title: 'Language Not Available',
        description: 'This article is not available in the requested language.'
      };
    }

    const seo = contentForLang.seo;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';
    
    // Generate alternate URLs for all supported languages in the article
    const supportedLocales = article.contentsByLanguage.map((c: { seo: { hreflang: string } }) => c.seo.hreflang) as SupportedLocale[];
    const alternates = generateAlternateUrls(slug, supportedLocales, baseUrl);
    
    // Generate structured data
    const structuredData = generateArticleStructuredData(article, lang as SupportedLocale, baseUrl);

    const metadata: Metadata = {
      metadataBase: new URL(baseUrl),
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.keywords,
      alternates: {
        canonical: seo.canonicalUrl,
        languages: alternates
      },
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: article.articleImages, // Use articleImages directly
        type: seo.type || 'article',
        locale: seo.hreflang,
        url: seo.canonicalUrl,
        siteName: 'Health',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: article.articleImages?.[0], // Use articleImages directly
      }
    };

    // Add hreflang and structured data if available
    if (structuredData) {
      metadata.other = {
        'application/ld+json': JSON.stringify(structuredData)
      };
    }

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the article.'
    };
  }
}