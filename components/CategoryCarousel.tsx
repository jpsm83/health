import { IArticle } from "@/interfaces/article";
import ArticleCard from "./ArticleCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { articleService } from "@/services/articleService";
import { useState, useEffect } from "react";

interface CategoryCarouselProps {
  category: string;
}

export default function CategoryCarousel({
  category,
}: CategoryCarouselProps) {
  const t = useTranslations('categoryCarousel');
  
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 6;

  // Fetch initial articles
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedArticles = await articleService.getArticlesByCategory({
          category,
          page: 1,
          limit,
          sort: 'createdAt',
          order: 'desc'
        });
        
        setArticles(fetchedArticles);
        setHasMore(fetchedArticles.length === limit);
        setCurrentPage(1);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch articles';
        setError(message);
        console.error(`Error fetching ${category} articles:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [category, limit]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newArticles = await articleService.getArticlesByCategory({
        category,
        page: currentPage + 1,
        limit,
        sort: 'createdAt',
        order: 'desc'
      });
      
      setArticles(prev => [...prev, ...newArticles]);
      setHasMore(newArticles.length === limit);
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch more articles';
      setError(message);
      console.error(`Error fetching more ${category} articles:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (articles.length === 0 && !loading) {
    return null;
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="mb-12">
      <hr className="my-4 border-1 border-gray-200" />
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {categoryTitle}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {hasMore && (
            <Button
              onClick={loadMore}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
          <a
            href={`/category/${category}`}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
          >
            {t("viewAll")} →
          </a>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-center py-4 text-red-600">
          Error loading articles: {error}
        </div>
      )}

      {/* Carousel */}
      <div className="relative sm:px-6 md:px-12">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {articles.map((article) => (
              <CarouselItem
                key={article._id?.toString() || Math.random().toString()}
                className="pl-2 md:pl-4 basis-64 flex-shrink-0"
              >
                <ArticleCard article={article} />
              </CarouselItem>
            ))}
            {loading && (
              <CarouselItem className="pl-2 md:pl-4 basis-64 flex-shrink-0">
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
                  <div className="text-gray-500">Loading...</div>
                </div>
              </CarouselItem>
            )}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="left-3" />
          <CarouselNext className="right-3" />
        </Carousel>
      </div>
    </div>
  );
}
