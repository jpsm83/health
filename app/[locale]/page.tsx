import { Metadata } from 'next';
import { generatePublicMetadata } from '@/lib/utils/metadata';
import Navigation from '@/components/Navigation';
import Home from '@/pages/HomePage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePublicMetadata(
    locale,
    '',
    'metadata.home.title',
    'metadata.home.description',
    'metadata.home.keywords'
  );
}

// Server Component - handles metadata generation
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}
