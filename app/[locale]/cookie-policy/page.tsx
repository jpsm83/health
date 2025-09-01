import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import CookiePolicy from '@/pagesClient/CookiePolicy';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/cookie-policy',
    'metadata.cookiePolicy.title'
  );
}

// Server Component - handles metadata generation
export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto">
      <CookiePolicy />
    </main>
  );
}
