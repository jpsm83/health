import Navigation from '@/components/Navigation';
import DashboardContent from '@/pages/DashboardPage';

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <DashboardContent />
      </main>
    </div>
  );
}
