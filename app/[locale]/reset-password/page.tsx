import Navigation from '@/components/Navigation';
import ResetPasswordContent from '@/pages/ResetPasswordPage';

export default async function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <ResetPasswordContent />
      </main>
    </div>
  );
}
