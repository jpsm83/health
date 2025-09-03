import ArticleCard from "./ArticleCard";
import { IArticleCardProps } from "@/interfaces/article";

interface FeaturedArticlesProps {
  articles: IArticleCardProps[] | null;
  title: string;
  description: string;
}

export default function ExploteArticles({ articles, title, description }: FeaturedArticlesProps) {
  if (articles?.length === 0 || !articles) {
    return null;
  }

  console.log("articles on featured articles", articles);
  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10 bg-gradient-to-r from-red-500 to-pink-500 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: IArticleCardProps) => (
          <div key={article.id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
