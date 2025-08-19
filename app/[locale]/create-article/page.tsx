import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/metadata';
import Navigation from '@/components/Navigation';
import CreateArticleContent from '@/pages/CreateArticlePage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/create-article',
    'metadata.createArticle.title',
    'metadata.createArticle.description',
    'metadata.createArticle.keywords'
  );
}

// Server Component - handles metadata generation
export default function CreateArticlePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <CreateArticleContent />
      </main>
    </div>
  );
}
