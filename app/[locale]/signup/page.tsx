import Navigation from '@/components/Navigation';
import SignUpContent from '@/pages/SignUpPage';

export default async function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <SignUpContent />
      </main>
    </div>
  );
}
