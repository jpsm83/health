import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import DashboardContent from '@/pages/DashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
  
  return generatePrivateMetadata(
    locale,
    '/dashboard',
    'metadata.dashboard.title'
  );
}

// Server Component - handles metadata generation
export default function DashboardPage() {
  return (
      <main className="container mx-auto px-4 py-8">
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      </main>
  );
}
