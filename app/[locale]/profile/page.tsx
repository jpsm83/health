import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import ProfileContent from '@/pages/ProfilePage';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/profile',
    'metadata.profile.title'
  );
}

// Server Component - handles metadata generation
export default function ProfilePage() {
  return (
      <main className="max-w-4xl mx-auto py-8 px-4">
        <ProfileContent />
      </main>
  );
}
