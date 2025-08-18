import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('article');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
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
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {t('subtitle')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>📅 {t('info.published')}: {new Date().toLocaleDateString()}</span>
            <span>👤 {t('info.author')}: John Doe</span>
            <span>🏷️ {t('info.category')}: {t('info.healthCategory')}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('content.paragraph1')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t('content.paragraph2')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('content.paragraph3')}
            </p>
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
                {t('info.language')}: {locale.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {t('info.slug')}: <span className="font-mono">{slug}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                {t('info.date')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
