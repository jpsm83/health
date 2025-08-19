'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

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

interface ArticlePageProps {
  article: {
    _id: string;
    category: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    articleImages: string[];
    contentsByLanguage: ArticleContent[];
  };
  slug: string;
}

export default function ArticlePage({ article, slug }: ArticlePageProps) {
  const t = useTranslations('article');
  const locale = useLocale();

  // Get the content for the current language
  const content = article.contentsByLanguage.find(
    (content: ArticleContent) => content.seo.hreflang === locale
  );

  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Content not available in {locale.toUpperCase()}</p>
      </div>
    );
  }

  return (
    <>
      {/* Back to Articles Link */}
      <div className="mb-6">
        <Link 
          href={`/${locale}`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← {t('actions.backToList')}
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {content.mainTitle}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>📅 {t('info.published')}: {article.createdAt?.toLocaleDateString()}</span>
          <span>🏷️ {t('info.category')}: {article.category}</span>
          <span>🌐 {t('info.language')}: {locale.toUpperCase()}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="prose max-w-none">
          {content.articleContents.map((section: { subTitle: string; articleParagraphs: string[] }, index: number) => (
            <div key={index} className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {section.subTitle}
              </h2>
              {section.articleParagraphs.map((paragraph: string, pIndex: number) => (
                <p key={pIndex} className="text-lg text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Article Actions */}
      <div className="flex space-x-4 mb-8">
        <Link
          href={`/${locale}/article/${slug}/update`}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {t('actions.edit')}
        </Link>
        <button
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {t('actions.delete')}
        </button>
      </div>

      {/* Article Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              {t('info.slug')}: <span className="font-mono">{slug}</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {t('info.date')}: {article.createdAt?.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {t('info.status')}: {article.status}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
