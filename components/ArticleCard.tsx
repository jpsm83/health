import { MockArticle } from "@/lib/mockData";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";

interface ArticleCardProps {
  article: MockArticle;
  className?: string;
}

export default function ArticleCard({
  article,
  className = "",
}: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`group bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Article Image */}
      <div className="relative overflow-hidden h-48">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
