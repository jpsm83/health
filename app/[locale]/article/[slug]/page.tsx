'use client';

import Navigation from '@/components/Navigation';
import ArticlePage from '@/pages/ArticlePage';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Type definitions for article content
interface ArticleContent {
  mainTitle: string;
  articleContents: Array<{
    subTitle: string;
    articleParagraphs: string[];
  }>;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
    hreflang: string;
    canonicalUrl: string;
  };
}

interface Article {
  _id: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  articleImages: string[];
  contentsByLanguage: ArticleContent[];
}

export default function ArticlePageWrapper() {
  const params = useParams();
  const { locale, slug } = params as { locale: string; slug: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`/api/articles/${slug}?locale=${locale}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (slug && locale) {
      fetchArticle();
    }
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg">Loading article...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-lg text-red-600">Article not found</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
        <ArticlePage article={article} slug={slug} />
      </main>
    </div>
  );
}
