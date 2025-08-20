import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import Navigation from '@/components/Navigation';
import SignUpContent from '@/pages/SignUpPage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/signup',
    'metadata.signup.title'
  );
}

// Server Component - handles metadata generation
export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SignUpContent />
      </main>
    </div>
  );
}
