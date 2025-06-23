// app/news/[lang]/[slug]/page.tsx
import { Metadata } from 'next';
import Article from '@/app/api/models/article';
import connectDb from '@/app/api/db/connectDb';

interface ContentItem {
  imageUrl: string;
  subTitle: string;
  articleParagraphs: string[];
}

export async function generateDynamicMetadata({ 
  params 
}: { 
  params: { lang: string, slug: string } 
}): Promise<Metadata> {
  const { lang, slug } = params;
  
  try {
    // Connect to database
    await connectDb();
    
    // Fetch the article by language and slug
    const article = await Article.findOne({
      'content.language': lang,
      'content.seo.slug': slug
    });
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      };
    }
    // Find the content for the specific language
    const contentForLang = article.content.find((c: { language: string }) => c.language === lang);
    if (!contentForLang) {
      return {
        title: 'Language Not Available',
        description: 'This article is not available in the requested language.'
      };
    }

    const seo = contentForLang.seo;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

    return {
      metadataBase: new URL(baseUrl),
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords: seo.keywords,
      alternates: {
        canonical: seo.canonicalUrl,
        languages: {
          'en': `/article/en/${seo.slug}`,
          'pt': `/article/pt/${seo.slug}`,
          'es': `/article/es/${seo.slug}`,
          'fr': `/article/fr/${seo.slug}`,
          'de': `/article/de/${seo.slug}`,
          'it': `/article/it/${seo.slug}`,
          'nl': `/article/nl/${seo.slug}`,
          'he': `/article/he/${seo.slug}`,
          'de-DE': `/article/de-DE/${seo.slug}`,
        }
      },
      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: seo.imagesUrl || contentForLang.content.map((c: ContentItem) => c.imageUrl),
        type: seo.type,
        locale: lang,
        url: seo.canonicalUrl,
        siteName: 'Health',
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: seo.imagesUrl?.[0] || contentForLang.content[0]?.imageUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the article.'
    };
  }
}
