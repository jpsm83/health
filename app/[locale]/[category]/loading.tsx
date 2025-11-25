import { CategoryHeroSkeleton } from "@/components/skeletons/CategoryHeroSkeleton";
import { FeaturedArticlesSkeleton } from "@/components/skeletons/FeaturedArticlesSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <div className="mb-8 md:mb-16">
        <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
          {/* Above fold content - show immediately */}
          <CategoryHeroSkeleton />
          <FeaturedArticlesSkeleton />
        </div>
      </div>
    </main>
  );
}
