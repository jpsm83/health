import ArticleCard from "./ArticleCard";
import { ISerializedArticle } from "@/types/article";

// Simple loading skeleton for mobile
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
        <div className="h-40 bg-gray-200 animate-pulse" />
        <div className="p-3 flex-1 flex flex-col gap-3">
          <div className="h-4 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 bg-gray-200 animate-pulse rounded" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

interface FeaturedArticlesProps {
  articles: ISerializedArticle[] | null;
  title?: string;
  description?: string;
  showBanner?: boolean;
  isLoading?: boolean;
}

export default function FeaturedArticles({
  articles,
  title,
  description,
  showBanner = true,
  isLoading = false,
}: FeaturedArticlesProps) {
  // Show loading state for mobile when loading
  if (isLoading) {
    return (
      <section>
        {showBanner && (
          <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
            <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        )}
        <LoadingSkeleton />
      </section>
    );
  }

  // Show nothing when no articles
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Section Header */}
      {showBanner && (
        <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
          <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      )}

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: ISerializedArticle) => (
          <div key={article._id?.toString() || ""}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
