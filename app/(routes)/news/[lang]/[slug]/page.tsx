// app/news/[lang]/[slug]/page.tsx
import { Metadata } from 'next';

// This function runs on every request
export async function generateMetadata({ params }): Promise<Metadata> {
  const { lang, slug } = params;
  
  // Fetch news data from database
  const news = await getNewsBySlug(slug);
  const content = news.content.find(c => c.language === lang) || news.content[0];
  
  return {
    title: content.seo.metaTitle,
    description: content.seo.metaDescription,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.metaTitle,
      description: content.seo.metaDescription,
      images: [content.imageUrl],
      type: 'article',
      locale: lang,
    },
    alternates: {
      canonical: `https://yourdomain.com/news/${lang}/${content.seo.slug}`,
      languages: {
        'en': `/news/en/${content.seo.slug}`,
        'pt': `/news/pt/${content.seo.slug}`,
        // Add other languages
      }
    }
  };
}

// The page component
export default async function NewsPage({ params }) {
  const { lang, slug } = params;
  const news = await getNewsBySlug(slug);
  const content = news.content.find(c => c.language === lang) || news.content[0];
  
  return (
    <article>
      <h1>{content.mainTitle}</h1>
      {/* Rest of your content */}
    </article>
  );
}