import { getLanguageConfig } from '@/lib/utils/languageUtils';
import { notFound } from 'next/navigation';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const langConfig = getLanguageConfig(locale);

  if (!langConfig) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
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
            <span className="font-medium text-blue-900">
              {langConfig.language.toUpperCase()} - {langConfig.country}
            </span>
          </div>
          <div className="text-sm text-blue-700">
            Current Language: {langConfig.language.toUpperCase()}
          </div>
        </div>
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}
