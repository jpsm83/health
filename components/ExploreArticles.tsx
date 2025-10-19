import ArticleCard from "./ArticleCard";
import { ISerializedArticle } from "@/types/article";

interface IFeaturedArticlesProps {
  articles: ISerializedArticle[] | null;
  title: string;
  description: string;
}

export default function ExploteArticles({
  articles,
  title,
  description,
}: IFeaturedArticlesProps) {
  if (articles?.length === 0 || !articles) {
    return null;
  }

  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10 bg-gradient-to-r from-orange-600 to-yellow-500 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)'}}>{title}</h2>
        <p className="text-lg text-white max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Featured Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: ISerializedArticle) => (
          <div key={article._id}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
