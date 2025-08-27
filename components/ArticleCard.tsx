import { MockArticle } from "@/lib/mockData";
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';

interface ArticleCardProps {
  article: MockArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const t = useTranslations('articleCard');
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link
      href={`${locale}/article/${article.slug}`}
      className="bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
    >
      {/* Article Image - More height, narrower width */}
      <div className="relative overflow-hidden h-40 flex-shrink-0">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded-full capitalize">
            {article.category}
          </span>
        </div>
      </div>

      {/* Article Content - Reduced padding and spacing */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        {/* Title - Smaller fixed height */}
        <h3 className="font-semibold text-gray-900 leading-tight hover:text-pink-600 transition-colors duration-200">
          {article.title}
        </h3>

        {/* Excerpt - Smaller minimum height */}
        <p className="text-gray-600 text-sm">{article.excerpt}</p>

        {/* Meta Information - Smaller spacing */}
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
    </Link>
  );
}
