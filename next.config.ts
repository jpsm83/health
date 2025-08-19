import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	// Skip static optimization during build
	trailingSlash: false,
	generateBuildId: async () => {
		return 'build-' + Date.now()
	},
};

export default withNextIntl(nextConfig);
