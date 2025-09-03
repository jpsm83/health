import { IArticle } from "@/interfaces/article";

// For server-side requests, use absolute URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || '';
  } else {
    // Server-side - construct absolute URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
    return `${protocol}://${host}`;
  }
};

export interface GetArticlesParams {
  category?: string;
  slug?: string;
  locale?: string;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  query?: string;
}

/**
 * Universal function to get articles with various filters and options
 * @param params - Object containing filtering and sorting options
 * @returns Promise<IArticle[]> for multiple articles or Promise<IArticle | null> for single article
 * 
 * @example
 * // Get all articles
 * const allArticles = await getArticles();
 * 
 * // Get featured articles (9 most recent)
 * const featured = await getArticles({ limit: 9, sort: 'createdAt', order: 'desc' });
 * 
 * // Get articles by category
 * const healthArticles = await getArticles({ category: 'health' });
 * 
 * // Get single article by category and slug
 * const article = await getArticles({ category: 'health', slug: 'article-slug' });
 * 
 * // Get single article by slug only (searches across all categories)
 * const articleBySlug = await getArticles({ slug: 'article-slug' });
 * 
 * // Search articles
 * const searchResults = await getArticles({ query: 'vitamins', limit: 10 });
 * 
 * // Get articles with specific locale
 * const spanishArticles = await getArticles({ locale: 'es', limit: 5 });
 */
export const getArticles = async (params: GetArticlesParams = {}): Promise<IArticle[] | IArticle | null> => {
  try {
    const {
      category,
      slug,
      locale = 'en',
      limit,
      sort = 'createdAt',
      order = 'desc',
      query
    } = params;

    const baseUrl = getBaseUrl();
    let url: string;

    // Build URL based on parameters
    if (category && slug) {
      // Single article by category and slug
      url = `${baseUrl}/api/v1/articles/category/${category}/${slug}?locale=${locale}`;
    } else if (category) {
      // Articles by category
      url = `${baseUrl}/api/v1/articles/category/${category}?locale=${locale}`;
    } else if (slug) {
      // Single article by slug only (search across all categories)
      const searchParams = new URLSearchParams();
      searchParams.append('slug', slug);
      if (locale) searchParams.append('locale', locale);
      
      url = `${baseUrl}/api/v1/articles?${searchParams.toString()}`;
    } else {
      // All articles with optional filters
      const searchParams = new URLSearchParams();
      if (locale) searchParams.append('locale', locale);
      if (limit) searchParams.append('limit', limit.toString());
      if (sort) searchParams.append('sort', sort);
      if (order) searchParams.append('order', order);
      if (query) searchParams.append('query', query);
      
      url = `${baseUrl}/api/v1/articles?${searchParams.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Enable caching for better performance
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Return appropriate empty value based on expected return type
        return slug ? null : [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Return single article if slug is provided (with or without category), otherwise return array
    if (slug) {
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return appropriate empty value based on expected return type
    return params.slug ? null : [];
  }
};

// Convenience functions that use the main getArticles function
export const getAllArticles = async (): Promise<IArticle[]> => {
  return getArticles() as Promise<IArticle[]>;
};

export const getFeaturedArticles = async (category?: string, query?: string, locale = 'en'): Promise<IArticle[]> => {
  return getArticles({ 
    category, 
    query, 
    locale,
    limit: 9, 
    sort: 'createdAt', 
    order: 'desc' 
  }) as Promise<IArticle[]>;
};

export const getArticlesByCategory = async (category: string, locale = 'en'): Promise<IArticle[]> => {
  return getArticles({ category, locale }) as Promise<IArticle[]>;
};

export const getArticleBySlug = async (slug: string): Promise<IArticle | null> => {
  return getArticles({ slug }) as Promise<IArticle | null>;
};