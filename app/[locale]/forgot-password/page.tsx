import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import ForgotPasswordContent from '@/pages/ForgotPasswordPage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/forgot-password',
    'metadata.forgotPassword.title'
  );
}

// Server Component - handles metadata generation
export default function ForgotPasswordPage() {
  return (
      <main className="container mx-auto px-4 py-8">
        <ForgotPasswordContent />
      </main>
  );
}
