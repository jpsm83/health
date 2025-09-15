import { IArticle, IArticleCardProps } from "@/interfaces/article";

/**
 * Convert IArticle[] to IArticleCardProps[] for display components
 */
export const transformArticlesToCardProps = (articles: IArticle[]): IArticleCardProps[] => {
  return articles.map((article: IArticle) => {
    const content = article.contentsByLanguage[0]; // Get first (and only) content
    
    return {
      id: article._id?.toString() || '',
      title: content.mainTitle,
      excerpt: content.seo.metaDescription,
      category: article.category,
      author: typeof article.createdBy === 'object' && article.createdBy && 'username' in article.createdBy
        ? (article.createdBy as { username: string }).username
        : 'Women\'s Spot Team',
      publishedAt: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      readTime: '5 min read', // Default read time
      imageUrl: article.articleImages && article.articleImages.length > 0 ? article.articleImages[0] : '/womens-spot.png',
      slug: content.seo.slug,
    };
  });
};
