import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from '@/i18n';
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
	
	// For static files like sw.js, use a default locale and empty messages
	if (locale.includes('.') || locale === 'sw.js') {
		const defaultMessages = {};
		return (
			<NextIntlClientProvider messages={defaultMessages} locale="en">
				{children}
			</NextIntlClientProvider>
		);
	}
	
	// Validate locale and get messages
	if (!locales.includes(locale as Locale)) {
		console.error(`Invalid locale detected: ${locale}, falling back to ${defaultLocale}`);
		// Instead of throwing an error, redirect to default locale
		const defaultMessages = await getMessages({ locale: defaultLocale });
		return (
			<NextIntlClientProvider messages={defaultMessages} locale={defaultLocale}>
				{children}
			</NextIntlClientProvider>
		);
	}
	
	try {
		console.log(`Loading messages for locale: ${locale}`);
		const messages = await getMessages({ locale });
		
		console.log(`Messages loaded:`, Object.keys(messages || {}));
		
		if (!messages || Object.keys(messages).length === 0) {
			console.error(`No messages loaded for locale: ${locale}, falling back to ${defaultLocale}`);
			const defaultMessages = await getMessages({ locale: defaultLocale });
			return (
				<NextIntlClientProvider messages={defaultMessages} locale={defaultLocale}>
					{children}
				</NextIntlClientProvider>
			);
		}
		
		return (
			<NextIntlClientProvider messages={messages} locale={locale}>
				{children}
			</NextIntlClientProvider>
		);
	} catch (error) {
		console.error(`Error loading messages for locale ${locale}:`, error);
		// Fallback to default locale
		const defaultMessages = await getMessages({ locale: defaultLocale });
		return (
			<NextIntlClientProvider messages={defaultMessages} locale={defaultLocale}>
				{children}
			</NextIntlClientProvider>
		);
	}
}
