'use client';

import { getLanguageConfig } from '@/lib/utils/languageUtils';
import Navigation from '@/components/Navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t, currentLanguage } = useTranslation();
  const langConfig = getLanguageConfig(currentLanguage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {t('home.subtitle')}
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {t('home.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('home.features.articles')}
            </h3>
            <p className="text-gray-600">
              Access comprehensive health articles and research
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('home.features.dashboard')}
            </h3>
            <p className="text-gray-600">
              Track your health goals and progress
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('home.features.profile')}
            </h3>
            <p className="text-gray-600">
              Manage your personal health information
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('home.features.createArticle')}
            </h3>
            <p className="text-gray-600">
              Share your health knowledge with others
            </p>
          </div>
        </div>

        {/* Language Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">
              {langConfig.country === 'US' ? '🇺🇸' :
               langConfig.country === 'BR' ? '🇧🇷' :
               langConfig.country === 'PT' ? '🇵🇹' :
               langConfig.country === 'ES' ? '🇪🇸' :
               langConfig.country === 'MX' ? '🇲🇽' :
               langConfig.country === 'FR' ? '🇫🇷' :
               langConfig.country === 'DE' ? '🇩🇪' :
               langConfig.country === 'IT' ? '🇮🇹' :
               langConfig.country === 'NL' ? '🇳🇱' :
               langConfig.country === 'IL' ? '🇮🇱' :
               langConfig.country === 'RU' ? '🇷🇺' : '🌐'}
            </span>
            <span className="text-lg font-medium text-blue-900">
              {langConfig.language.toUpperCase()} - {langConfig.country}
            </span>
          </div>
          <p className="text-blue-700">
            Current Language: {langConfig.language.toUpperCase()}
          </p>
        </div>
      </main>
    </div>
  );
}
