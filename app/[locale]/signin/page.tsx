'use client';

import Navigation from '@/components/Navigation';
import SignInContent from '@/pages/SignInPage';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SignInContent />
      </main>
    </div>
  );
}
