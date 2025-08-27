import { Metadata } from 'next';
import { generatePublicMetadata } from '@/lib/utils/genericMetadata';
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
    'metadata.home.title'
  );
}

// Server Component - handles metadata generation
export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-[#f9fafb]">
      <main className="container mx-auto">
        <Home />
      </main>
    </div>
  );
}
