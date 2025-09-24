import { ISerializedArticle } from "@/types/article";
import ArticleCard from "./ArticleCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useTranslations, useLocale } from "next-intl";

import { useState, useEffect, useCallback, useRef } from "react";
import { getArticlesByCategory } from "@/app/actions/article/getArticlesByCategory";

interface CategoryCarouselProps {
  category: string;
  initialArticles?: ISerializedArticle[];
}

export default function CategoryCarousel({ category, initialArticles = [] }: CategoryCarouselProps) {
  const t = useTranslations("categoryCarousel");
  const locale = useLocale();

  const [articles, setArticles] = useState<ISerializedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const limit = 6;
  const [api, setApi] = useState<CarouselApi>();
  const initialized = useRef(false);

  // Initialize with pre-fetched articles or fetch if not provided
  useEffect(() => {
    if (initialized.current) return;
    
    if (initialArticles !== undefined && initialArticles.length > 0) {
      // Use pre-fetched articles (only if not empty)
      setArticles(initialArticles);
      setLoading(false);
      setHasMore(initialArticles.length >= limit);
      initialized.current = true;
    } else {
      // Fetch articles if not provided (fallback for backward compatibility)
      const fetchArticles = async () => {
        setLoading(true);
        setError(null);

        try {
          const fetchedArticles = await getArticlesByCategory({
            category,
            page: 1,
            limit,
            sort: "createdAt",
            order: "desc",
            locale,
          });
          setArticles(fetchedArticles.data);
          setHasMore(fetchedArticles.data.length >= limit);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : t("failedToFetchArticles");
          setError(message);
          console.error(`Error fetching ${category} articles:`, err);
          
          // Log mobile-specific debugging info
          console.error("Mobile carousel error context:", {
            category,
            locale,
            userAgent: navigator?.userAgent,
            timestamp: new Date().toISOString(),
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        } finally {
          setLoading(false);
          initialized.current = true;
        }
      };

      fetchArticles();
    }
  }, [category, limit, locale, t]);

  // Load more articles
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const excludeIds = articles
        .map((article) => article._id?.toString())
        .filter((id): id is string => Boolean(id));

      const newArticles = await getArticlesByCategory({
        category,
        limit,
        sort: "createdAt",
        order: "desc",
        excludeIds,
        locale,
      });

      if (newArticles.data.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prev) => [...prev, ...newArticles.data]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("failedToFetchMoreArticles")
      );
    } finally {
      setLoadingMore(false);
    }
  }, [category, articles, limit, loadingMore, hasMore, locale, t]);

  // Embla scroll event listener - trigger loadMore when reaching end
  useEffect(() => {
    if (!api || !hasMore || loadingMore) return;

    const handleScroll = () => {
      if (!api.canScrollNext() && hasMore && !loadingMore) {
        loadMore();
      }
    };

    api.on("scroll", handleScroll);

    return () => {
      api.off("scroll", handleScroll);
    };
  }, [api, hasMore, loadingMore, loadMore]);

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
          <a
            href={`/${category}`}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
          >
            {t("viewAll")} →
          </a>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="text-center py-4 text-red-600">
          {t("errorLoading")} {error}
        </div>
      )}

      {/* Carousel */}
      <div className="relative sm:px-6 md:px-12">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
            containScroll: "trimSnaps",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {articles.map((article, index) => (
              <CarouselItem
                key={`${article._id?.toString() || "unknown"}-${index}`}
                className="pl-2 md:pl-4 basis-64 flex-shrink-0"
              >
                <ArticleCard article={article} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious
            className="left-0 rounded-none border-none h-full bg-gradient-to-r from-[#d1d5db] to-transparent hover:bg-gradient-to-r hover:from-[#a9adb1] hover:to-transparent transition-colors duration-500 ease-in-out
"
          />

          <CarouselNext
            className="right-0 rounded-none border-none h-full bg-gradient-to-l from-[#d1d5db] to-transparent hover:bg-gradient-to-l hover:from-[#a9adb1] hover:to-transparent transition-colors duration-500 ease-in-out
"
          />
        </Carousel>
      </div>
    </div>
  );
}
