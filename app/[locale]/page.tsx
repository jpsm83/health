'use client';

import Navigation from '@/components/Navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Metadata } from 'next';

export default function HomePage() {
  const t = useTranslations('home');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {t('subtitle')}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('features.articles')}
            </h3>
            <p className="text-gray-600">
              {t('featureDescriptions.articles')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('features.dashboard')}
            </h3>
            <p className="text-gray-600">
              {t('featureDescriptions.dashboard')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('features.profile')}
            </h3>
            <p className="text-gray-600">
              {t('featureDescriptions.profile')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('features.createArticle')}
            </h3>
            <p className="text-gray-600">
              {t('featureDescriptions.createArticle')}
            </p>
          </div>
        </div>

        {/* Language Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">
              {locale === 'en' ? '🇺🇸' :
               locale === 'pt' ? '🇧🇷' :
               locale === 'es' ? '🇪🇸' :
               locale === 'fr' ? '🇫🇷' :
               locale === 'de' ? '🇩🇪' :
               locale === 'it' ? '🇮🇹' :
               locale === 'nl' ? '🇳🇱' :
               locale === 'he' ? '🇮🇱' :
               locale === 'ru' ? '🇷🇺' : '🌐'}
            </span>
            <span className="text-lg font-medium text-blue-900">
              {locale.toUpperCase()}
            </span>
          </div>
          <p className="text-blue-700">
            {t('languageInfo.currentLanguage')}: {locale.toUpperCase()}
          </p>
        </div>
      </main>
    </div>
  );
}
