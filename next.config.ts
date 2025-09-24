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
	// Optimize CSS loading to prevent preload warnings
	experimental: {
		optimizeCss: false, // Disabled to avoid critters dependency issue
		optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
		// Mobile-specific optimizations
		serverComponentsExternalPackages: ['mongoose'],
	},
	// Optimize CSS and prevent preload warnings
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production' ? {
			exclude: ['error']
		} : false,
	},
	// Configure allowed image domains for Next.js Image component
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default withNextIntl(nextConfig);
