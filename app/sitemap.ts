import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { mainCategories } from '@/lib/constants';
import connectDb from '@/app/api/db/connectDb';
import Article from '@/app/api/models/article';
import { ILanguageSpecific } from '@/types/article';

// Get base URL from environment variables
function getBaseUrl(): string {
  return (
    process.env.NEXTAUTH_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://womensspot.com'
  ).replace(/\/$/, ''); // Remove trailing slash
}

// Static pages that should be included in sitemap
const staticPages = [
  '',
  'about',
  'search',
  'site-map',
  'privacy-policy',
  'terms-conditions',
  'cookie-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const locales = routing.locales;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      // Default locale (en) doesn't have prefix per routing config
      const path = locale === 'en' 
        ? (page ? `/${page}` : '/')
        : `/${locale}${page ? `/${page}` : ''}`;
      const url = `${baseUrl}${path}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => {
              const altPath = loc === 'en' 
                ? (page ? `/${page}` : '/')
                : `/${loc}${page ? `/${page}` : ''}`;
              return [loc, `${baseUrl}${altPath}`];
            })
          ),
        },
      });
    }

    // Add category pages for each locale
    for (const category of mainCategories) {
      // Default locale (en) doesn't have prefix per routing config
      const path = locale === 'en' ? `/${category}` : `/${locale}/${category}`;
      const url = `${baseUrl}${path}`;
      
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => {
              const altPath = loc === 'en' ? `/${category}` : `/${loc}/${category}`;
              return [loc, `${baseUrl}${altPath}`];
            })
          ),
        },
      });
    }
  }

  // Add published articles for each locale
  try {
    await connectDb();
    
    // Fetch all published articles
    const articles = await Article.find({ status: 'published' })
      .select('languages category updatedAt createdAt')
      .lean();

    for (const article of articles) {
      if (!article.languages || article.languages.length === 0) continue;

      // For each language version of the article
      for (const langData of article.languages) {
        const locale = langData.hreflang;
        const slug = langData.seo?.slug;

        if (!slug || !locale) continue;

        const path = locale === 'en' 
          ? `/${article.category}/${slug}` 
          : `/${locale}/${article.category}/${slug}`;
        const url = `${baseUrl}${path}`;

        // Determine last modified date
        const lastModified = article.updatedAt || article.createdAt || new Date();

        sitemapEntries.push({
          url,
          lastModified: new Date(lastModified),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              article.languages
                .filter((l: ILanguageSpecific) => l.seo?.slug)
                .map((l: ILanguageSpecific) => [
                  l.hreflang,
                  l.hreflang === 'en'
                    ? `${baseUrl}/${article.category}/${l.seo.slug}`
                    : `${baseUrl}/${l.hreflang}/${article.category}/${l.seo.slug}`,
                ])
            ),
          },
        });
      }
    }
  } catch (error) {
    console.error('Error generating sitemap for articles:', error);
    // Continue with static pages even if articles fail
  }

  return sitemapEntries;
}

