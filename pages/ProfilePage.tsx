'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function ProfileContent() {
  const t = useTranslations('profile');
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

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('sections.personal')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t('sections.preferences')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.language')}
                </label>
                <select
                  id="language"
                  name="language"
                  defaultValue={locale}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">{t('options.english')}</option>
                  <option value="pt">{t('options.portuguese')}</option>
                  <option value="es">{t('options.spanish')}</option>
                  <option value="fr">{t('options.french')}</option>
                  <option value="de">{t('options.german')}</option>
                  <option value="it">{t('options.italian')}</option>
                  <option value="nl">{t('options.dutch')}</option>
                  <option value="he">{t('options.hebrew')}</option>
                  <option value="ru">{t('options.russian')}</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fields.timezone')}
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  defaultValue="UTC"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="UTC">{t('options.utc')}</option>
                  <option value="EST">{t('options.easternTime')}</option>
                  <option value="PST">{t('options.pacificTime')}</option>
                  <option value="GMT">{t('options.gmt')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {t('actions.save')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
