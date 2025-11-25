import { Skeleton } from "@/components/ui/skeleton";

export function CategoryArticlesSkeleton() {
  // Configuration - matches category articles page structure
  // Note: This skeleton is kept for reference but individual skeletons are used in Suspense boundaries
  const FEATURED_ARTICLES_COUNT = 10;
  const ARTICLES_PER_PAGE = 10;

  return (
    <div className="mb-8 md:mb-16">
      <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
        {/* Products Banner Skeleton */}
        <Skeleton className="w-full h-[90px] rounded-md" />

        {/* Hero Section Skeleton */}
        <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="relative z-10 flex items-center justify-center h-full mx-3">
            <div className="text-center w-full max-w-4xl mx-auto px-4 md:px-6 space-y-4">
              <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
              <Skeleton className="h-6 md:h-8 w-5/6 mx-auto max-w-2xl" />
            </div>
          </div>
        </section>

        {/* Featured Articles First Section Skeleton */}
        <section>
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <Skeleton className="h-9 w-64 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: FEATURED_ARTICLES_COUNT }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden h-40 flex-shrink-0">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-2 left-2 z-10">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup Skeleton */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <div className="max-w-md mx-auto">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </section>

        {/* Products Banner Skeleton */}
        <Skeleton className="w-full h-[90px] rounded-md" />

        {/* Featured Articles Second Section Skeleton */}
        <section className="mb-6 md:mb-10">
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <Skeleton className="h-9 w-64 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden h-40 flex-shrink-0">
                  <Skeleton className="w-full h-full" />
                  <div className="absolute top-2 left-2 z-10">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination Skeleton */}
        <section className="pb-6 md:pb-10">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-10 w-20 rounded" />
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-10 w-10 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Products Banner Skeleton */}
      <Skeleton className="w-full h-[240px] rounded-md" />
    </div>
  );
}

