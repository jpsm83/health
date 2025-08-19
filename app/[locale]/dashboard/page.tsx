'use client';

import Navigation from '@/components/Navigation';
import DashboardContent from '@/pages/DashboardPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      </main>
    </div>
  );
}
