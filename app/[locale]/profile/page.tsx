import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import Navigation from '@/components/Navigation';
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <ProfileContent />
      </main>
    </div>
  );
}
