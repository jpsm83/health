'use client';

import Navigation from '@/components/Navigation';
import Home from '@/pages/HomePage';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}
