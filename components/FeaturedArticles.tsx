import ArticleCard from "./ArticleCard";
import { ISerializedArticle } from "@/types/article";
import ProductsBanner from "./ProductsBanner";

// Simple loading skeleton for mobile
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white shadow-sm overflow-hidden h-full flex flex-col"
      >
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
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <h2 className="text-3xl font-bold text-white text-center">
              {title}
            </h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
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
    <section className="cv-auto">
      {/* Section Header */}
      {showBanner && (
        <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
          <h2
            className="text-3xl font-bold text-white text-center mb-2 md:mb-4"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)",
            }}
          >
            {title}
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">{description}</p>
        </div>
      )}

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cv-auto px-3 pb-4">
        {articles.slice(0, 2).map((article: ISerializedArticle) => (
          <div key={article._id?.toString() || ""}>
            <ArticleCard article={article} />
          </div>
        ))}
        <div className="h-full flex items-stretch">
          <ProductsBanner
            size="390x240"
            affiliateCompany="amazon"
            category={articles[0].category}
          />
        </div>
        {articles.slice(2, 8).map((article: ISerializedArticle) => (
          <div key={article._id?.toString() || ""}>
            <ArticleCard article={article} />
          </div>
        ))}
        <div className="h-full flex items-stretch">
          <ProductsBanner
            size="390x240"
            affiliateCompany="amazon"
            category={articles[9]?.category}
          />
        </div>
        {articles.slice(8).map((article: ISerializedArticle) => (
          <div key={article._id?.toString() || ""}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
