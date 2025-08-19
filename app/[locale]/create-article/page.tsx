'use client';

import Navigation from '@/components/Navigation';
import CreateArticleContent from '@/pages/CreateArticlePage';

export default function CreateArticlePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <CreateArticleContent />
      </main>
    </div>
  );
}
