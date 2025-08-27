import { MockArticle } from "@/lib/mockData";
import ArticleCard from "./ArticleCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from 'next-intl';

interface CategoryCarouselProps {
  category: string;
  articles: MockArticle[];
}

export default function CategoryCarousel({
  category,
  articles,
}: CategoryCarouselProps) {
  const t = useTranslations('categoryCarousel');

  if (articles.length === 0) {
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
        <a
          href={`/category/${category}`}
          className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors duration-200"
        >
          {t("viewAll")} →
        </a>
      </div>

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
                key={article.id}
                className="pl-2 md:pl-4 basis-64 flex-shrink-0"
              >
                <ArticleCard article={article} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="left-3" />
          <CarouselNext className="right-3" />
        </Carousel>
      </div>
    </div>
  );
}
