import { Skeleton } from "@/components/ui/skeleton";

export function ArticlesWithPaginationSkeleton() {
  return (
    <>
      {/* Articles Grid Skeleton - matches FeaturedArticles layout */}
      <section className="cv-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cv-auto px-3 pb-4">
          {/* First 2 article cards */}
          {[0, 1].map((i) => (
            <div key={i} className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-3 flex-1 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
          
          {/* Banner placeholder at position 3 */}
          <div className="h-full flex items-stretch">
            <Skeleton className="w-full h-full min-h-[240px]" />
          </div>
          
          {/* Next 7 article cards (positions 4-10) */}
          {[2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-3 flex-1 flex flex-col gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
          
          {/* Banner placeholder at position 10 */}
          <div className="h-full flex items-stretch">
            <Skeleton className="w-full h-full min-h-[240px]" />
          </div>
        </div>
      </section>
      
      {/* Pagination Skeleton */}
      <section className="flex justify-center py-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-20 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-10 rounded" />
          <Skeleton className="h-10 w-20 rounded" />
        </div>
      </section>
    </>
  );
}

