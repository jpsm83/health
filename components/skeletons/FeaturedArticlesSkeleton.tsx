import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedArticlesSkeleton() {
  return (
    <section className="cv-auto">
      {/* Header Section */}
      <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
        <Skeleton className="h-9 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto max-w-2xl" />
      </div>

      {/* Articles Grid - matches FeaturedArticles grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cv-auto px-3 pb-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
            <Skeleton className="h-48 w-full" />
            <div className="p-3 flex-1 flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

