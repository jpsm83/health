'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function DashboardContent() {
  const t = useTranslations('dashboard');
  const locale = useLocale();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('stats.articles')}
          </h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('stats.goals')}
          </h3>
          <p className="text-3xl font-bold text-green-600">5</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('stats.progress')}
          </h3>
          <p className="text-3xl font-bold text-purple-600">78%</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-3xl mb-2">🔥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {t('stats.streak')}
          </h3>
          <p className="text-3xl font-bold text-orange-600">12</p>
        </div>
      </div>

      {/* Language Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          {t('languageInfo.language')}: {locale.toUpperCase()}
        </p>
      </div>
    </>
  );
}
