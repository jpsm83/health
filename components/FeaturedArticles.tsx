import ArticleCard from "./ArticleCard";
import { IArticle } from "@/interfaces/article";

interface FeaturedArticlesProps {
  articles: IArticle[] | null;
  title?: string;
  description?: string;
  showBanner?: boolean;
}

export default function FeaturedArticles({
  articles,
  title,
  description,
  showBanner = true,
}: FeaturedArticlesProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Section Header */}
      {showBanner && (
      <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">{description}</p>
      </div>
      )}

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: IArticle) => (
          <div key={article._id?.toString() || ""}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
