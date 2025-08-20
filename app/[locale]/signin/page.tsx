import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import Navigation from '@/components/Navigation';
import SignInContent from '@/pages/SignInPage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/signin',
    'metadata.signin.title'
  );
}

// Server Component - handles metadata generation
export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SignInContent />
      </main>
    </div>
  );
}
