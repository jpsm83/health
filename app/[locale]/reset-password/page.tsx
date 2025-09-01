import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import ResetPassword from '@/pagesClient/ResetPassword';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/reset-password',
    'metadata.resetPassword.title'
  );
}

// Server Component - handles metadata generation
export default function ResetPasswordPage() {
  return (
      <main className="container mx-auto px-4 py-8">
        <ResetPassword />
      </main>
  );
}
