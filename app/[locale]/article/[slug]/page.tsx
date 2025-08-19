import { Metadata } from 'next';
import connectDb from '@/app/api/db/connectDb';
import Article from '@/app/api/models/article';
import ArticlePageClient from '@/pages/ArticlePageClient';
import { IContentsByLanguage } from '@/interfaces/article';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    await connectDb();
    
    // Find article by slug in the current language
    const article = await Article.findOne({
      "contentsByLanguage.seo.slug": slug,
      "contentsByLanguage.seo.hreflang": locale
    });
    
    if (!article) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      };
    }
    // Get the content for the current language
    const content = article.contentsByLanguage.find(
      (content: IContentsByLanguage) => content.seo.hreflang === locale
    );
    
    if (!content) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      };
    }
    
    // Build proper multilingual alternates
    const languageAlternates: Record<string, string> = {};
    article.contentsByLanguage.forEach((langContent: IContentsByLanguage) => {
      // Map your hreflang values to proper language codes
      const langMap: Record<string, string> = {
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
      
      const properLang = langMap[langContent.seo.hreflang] || langContent.seo.hreflang;
      languageAlternates[properLang] = langContent.seo.canonicalUrl;
    });
    
    return {
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      keywords: content.seo.keywords.join(', '),
      authors: [{ name: 'Health App Team' }],
      creator: 'Health App',
      publisher: 'Health App',
      metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
      robots: 'index, follow',
      alternates: {
        canonical: content.seo.canonicalUrl,
        languages: languageAlternates,
      },
      openGraph: {
        title: content.seo.metaTitle,
        description: content.seo.metaDescription,
        url: content.seo.canonicalUrl,
        siteName: 'Health App',
        locale: locale,
        type: 'article',
        images: article.articleImages.map((img: string) => ({
          url: img,
          width: 1200,
          height: 630,
          alt: content.seo.metaTitle,
        })),
      },
      twitter: {
        card: 'summary_large_image',
        title: content.seo.metaTitle,
        description: content.seo.metaDescription,
        images: article.articleImages,
      },
      other: {
        'language': locale,
        'article:published_time': article.createdAt?.toISOString(),
        'article:modified_time': article.updatedAt?.toISOString(),
        'article:author': 'Health App',
        'article:section': article.category,
      },
    };
    
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.'
    };
  }
}

// Server Component - fetches data on the server
export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  
  try {
    await connectDb();
    
    const article = await Article.findOne({
      "contentsByLanguage.seo.slug": slug,
      "contentsByLanguage.seo.hreflang": locale
    }).select({
      "contentsByLanguage": {
        $elemMatch: {
          "seo.hreflang": locale
        }
      },
      "category": 1,
      "articleImages": 1,
      "status": 1,
      "likes": 1,
      "comments": 1,
      "createdBy": 1,
      "createdAt": 1
    });
    
    if (!article) {
      return (
        <div className="min-h-screen bg-gray-50">
          <main className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="text-lg text-red-600">Article not found</div>
            </div>
          </main>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto py-8 px-4">
          <ArticlePageClient article={article} locale={locale} />
        </main>
      </div>
    );
    
  } catch (error) {
    console.error('Error fetching article:', error);
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg text-red-600">Error loading article</div>
          </div>
        </main>
      </div>
    );
  }
}