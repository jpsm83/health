import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import About from '@/pages/About';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/about',
    'metadata.about.title'
  );
}

// Server Component - handles metadata generation
export default function AboutPage() {
  return (
    <main className="container mx-auto">
      <About />
    </main>
  );
}
