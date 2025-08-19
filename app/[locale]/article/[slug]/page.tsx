import Navigation from '@/components/Navigation';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDb from '@/app/api/db/connectDb';
import Article from '@/app/api/models/article';
import ArticlePage from '@/pages/ArticlePage';

// Type definitions for article content
interface ArticleContent {
  mainTitle: string;
  articleContents: Array<{
    subTitle: string;
    articleParagraphs: string[];
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
    hreflang: string;
    canonicalUrl: string;
  };
}

// Generate dynamic metadata for each article
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
      (content: ArticleContent) => content.seo.hreflang === locale
    );
    
    if (!content) {
      return {
        title: 'Article Not Found',
        description: 'The requested article could not be found.'
      };
    }
    
    // Use the article's actual SEO metadata
    return {
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      keywords: content.seo.keywords.join(', '),
      authors: [{ name: 'Health App Team' }],
      creator: 'Health App',
      publisher: 'Health App',
      robots: 'index, follow',
      alternates: {
        canonical: content.seo.canonicalUrl,
        languages: Object.fromEntries(
          article.contentsByLanguage.map((content: ArticleContent) => [
            content.seo.hreflang, 
            content.seo.canonicalUrl
          ])
        ),
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

export default async function ArticlePageWrapper({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;

  try {
    await connectDb();
    
    // Find article by slug in the current language
    const article = await Article.findOne({
      "contentsByLanguage.seo.slug": slug,
      "contentsByLanguage.seo.hreflang": locale
    });
    
    if (!article) {
      notFound();
    }
    
    // Get the content for the current language
    const content = article.contentsByLanguage.find(
      (content: ArticleContent) => content.seo.hreflang === locale
    );
    
    if (!content) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-4xl mx-auto py-8 px-4">
          <ArticlePage article={article} slug={slug} />
        </main>
      </div>
    );
    
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}
