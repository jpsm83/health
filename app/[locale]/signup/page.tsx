import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import SignUp from '@/pagesClient/SignUp';

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
  return <SignUp />;
}
