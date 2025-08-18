import { getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations('profile');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-4xl mx-auto py-8 px-4">
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
                    <option value="GMT">{t('options.greenwichMeanTime')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('sections.security')}
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notifications" className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {t('fields.notifications')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('buttons.save')}
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('buttons.cancel')}
              </button>
            </div>
          </form>
        </div>

        {/* Language Info */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            {t('languageInfo.language')}: {locale.toUpperCase()}
          </p>
        </div>
      </main>
    </div>
  );
}
