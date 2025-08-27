import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import SiteMap from '@/pages/SiteMap';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/site-map',
    'metadata.siteMap.title'
  );
}

// Server Component - handles metadata generation
export default function SiteMapPage() {
  return (
    <main className="container mx-auto">
      <SiteMap />
    </main>
  );
}
