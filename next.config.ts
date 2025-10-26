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
	// Redirect /ads.txt to Ezoic managed file (301 permanent redirect)
	redirects: async () => [
		{
			source: '/ads.txt',
			destination: 'https://srv.adstxtmanager.com/19390/womensspot.org',
			permanent: true,
		},
	],
	// Use stable build ID for consistent metadata generation
	generateBuildId: async () => {
		return 'production-build'
	},
	// Force static generation for better metadata handling
	output: 'standalone',
	// Fix metadata streaming issue in Next.js 15.1+
	experimental: {
		optimizeCss: false, // Disabled to avoid critters dependency issue
		optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
		// Disable partial pre-rendering to fix metadata issues
		ppr: false,
	},
	// External packages for server components
	serverExternalPackages: ['mongoose'],
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
