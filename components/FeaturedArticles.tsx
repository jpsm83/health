import { MockArticle } from "@/lib/mockData";
import ArticleCard from "./ArticleCard";

interface FeaturedArticlesProps {
  articles: MockArticle[];
}

export default function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          Featured Articles
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Discover our latest insights, tips, and guides to help you live a
          healthier, more fulfilling life.
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="group">
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
