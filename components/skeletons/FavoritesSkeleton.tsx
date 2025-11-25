import { Skeleton } from "@/components/ui/skeleton";

export function FavoritesSkeleton() {
  return (
    <div className="flex flex-col min-h-full gap-12 md:gap-16 mb-12 md:mb-16">
      {/* Hero Section Skeleton */}
      <section className="relative w-full h-[70vh] min-h-[500px]">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 bg-black/30" />

        {/* Hero Content Skeleton */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <Skeleton className="h-16 w-96 mx-auto mb-6 bg-white/30" />
            <Skeleton className="h-8 w-80 mx-auto mb-10 bg-white/20" />
          </div>
        </div>
      </section>

      {/* Featured Articles Grid Skeleton */}
      <section>
        <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
          <Skeleton className="h-10 w-64 mx-auto bg-white/20 mb-4" />
          <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden h-full flex flex-col"
            >
              {/* Article Image Skeleton */}
              <div className="relative overflow-hidden h-40 flex-shrink-0">
                <Skeleton className="w-full h-full" />
                <div className="absolute top-2 left-2 z-10">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>

              {/* Article Content Skeleton */}
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

      {/* Newsletter Signup Section Skeleton */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-12 w-80 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <div className="max-w-md mx-auto">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Pagination Section Skeleton */}
      <section>
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-20 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-10 rounded" />
            <Skeleton className="h-10 w-20 rounded" />
          </div>
        </div>
      </section>
    </div>
  );
}

