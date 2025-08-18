import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/i18n';
import type { Metadata } from 'next';
import '../globals.css';

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	
	// Basic fallback metadata - articles will override this with their own SEO data
	return {
		title: `Health App - ${locale.toUpperCase()}`,
		description: 'Your comprehensive health and wellness platform',
		robots: 'index, follow',
		alternates: {
			languages: Object.fromEntries(
				locales.map(lang => [lang, `https://yourdomain.com/${lang}`])
			),
		},
	};
}

export default async function LocaleLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	
	// Validate locale and get messages
	if (!locales.includes(locale as Locale)) {
		throw new Error(`Invalid locale: ${locale}`);
	}
	
	const messages = await getMessages({ locale });

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider messages={messages} locale={locale}>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
