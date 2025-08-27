import { Metadata } from 'next';
import { generatePrivateMetadata } from '@/lib/utils/genericMetadata';
import Contact from '@/pages/Contact';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}): Promise<Metadata> {
  const { locale } = await params;
   
  return generatePrivateMetadata(
    locale,
    '/contact',
    'metadata.contact.title'
  );
}

// Server Component - handles metadata generation
export default function ContactPage() {
  return (
    <main className="container mx-auto">
      <Contact />
    </main>
  );
}
