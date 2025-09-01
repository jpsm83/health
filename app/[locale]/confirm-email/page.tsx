import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import ConfirmEmail from '@/pagesClient/ConfirmEmail';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/confirm-email',
    'metadata.confirmEmail.title'
  );
}

// Server Component - handles metadata generation
export default function ConfirmEmailPage() {
  return (
    <main className="container mx-auto">
      <ConfirmEmail />
    </main>
  );
}
