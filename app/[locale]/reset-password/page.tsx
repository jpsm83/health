import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/metadata';
import Navigation from '@/components/Navigation';
import ResetPasswordContent from '@/pages/ResetPasswordPage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/reset-password',
    'metadata.resetPassword.title',
    'metadata.resetPassword.description',
    'metadata.resetPassword.keywords'
  );
}

// Server Component - handles metadata generation
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <ResetPasswordContent />
      </main>
    </div>
  );
}
