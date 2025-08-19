import Navigation from '@/components/Navigation';
import ProfileContent from '@/pages/ProfilePage';

export default async function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <ProfileContent />
      </main>
    </div>
  );
}
