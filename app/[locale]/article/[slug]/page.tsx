import { Metadata } from 'next';
import connectDb from '@/app/api/db/connectDb';
import Article from '@/app/api/models/article';
import ArticlePageClient from '@/pages/ArticlePageClient';
import { generateArticleMetadataFromSlug, generateArticleNotFoundMetadata } from '@/lib/utils/articleMetadata';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  
  try {
    // Use the utility function to handle everything
    return await generateArticleMetadataFromSlug(locale, slug);
  } catch (error) {
    console.error('Error generating article metadata:', error);
    return generateArticleNotFoundMetadata();
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