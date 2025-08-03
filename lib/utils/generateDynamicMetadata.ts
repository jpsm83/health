import { Metadata } from "next";
import connectDb from "@/app/api/db/connectDb";
import Article from "@/app/api/models/article";
import { 
  generateAlternateUrls, 
  generateArticleStructuredData,
  isSupportedLocale,
  SupportedLocale 
} from "@/app/api/utils/languageUtils";

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