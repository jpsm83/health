import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import TermsConditions from '@/pages/TermsConditions';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/terms-conditions',
    'metadata.termsConditions.title'
  );
}

// Server Component - handles metadata generation
export default function TermsConditionsPage() {
  return (
    <main className="container mx-auto">
      <TermsConditions />
    </main>
  );
}
