'use client';

import Navigation from '@/components/Navigation';
import ForgotPasswordContent from '@/pages/ForgotPasswordPage';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <ForgotPasswordContent />
      </main>
    </div>
  );
}
