import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Configuration - easily adjustable
  // Change these values to customize the number of skeleton articles displayed
  const FEATURED_ARTICLES_COUNT = 9; // Number of fixed articles in first section
  const ARTICLES_PER_PAGE = 15; // Number of articles per page in second section

  // Examples:
  // FEATURED_ARTICLES_COUNT = 3, ARTICLES_PER_PAGE = 4 → First section: 3 skeletons, Second section: 4 skeletons
  // FEATURED_ARTICLES_COUNT = 1, ARTICLES_PER_PAGE = 6 → First section: 1 skeleton, Second section: 6 skeletons

  return (
    <main className="container mx-auto">
      <div className="flex flex-col min-h-screen gap-8 md:gap-16">
        {/* Hero Section Skeleton - matches Articles.tsx exactly */}
        <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
          <Skeleton className="w-full h-full bg-gray-200" />
          
          {/* Hero Content Skeleton - matches the text structure */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <Skeleton className="h-16 w-96 mx-auto bg-white/30 mb-6" />
              <Skeleton className="h-8 w-80 mx-auto bg-white/20 mb-10" />
            </div>
          </div>
        </section>

        {/* First Featured Articles Section Skeleton - matches the first FeaturedArticles */}
        <section>
          <div className="text-center mb-10 bg-gradient-to-r from-red-600 to-pink-600 p-4 md:p-8">
            <Skeleton className="h-10 w-64 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>

          {/* Featured Articles Grid - matches the exact grid structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: FEATURED_ARTICLES_COUNT }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden h-full flex flex-col">
                {/* Article Image Skeleton */}
                <div className="relative overflow-hidden h-40 flex-shrink-0">
                  <Skeleton className="w-full h-full bg-gray-200" />
                  <div className="absolute top-2 left-2 z-10">
                    <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />
                  </div>
                </div>

                {/* Article Content Skeleton */}
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-12 w-full bg-gray-200" />
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton className="h-3 w-12 bg-gray-200" />
                    <Skeleton className="h-3 w-12 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup Section Skeleton - matches NewsletterSignup */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-80 mx-auto mb-4 bg-gray-200" />
            <Skeleton className="h-6 w-96 mx-auto mb-8 bg-gray-200" />
            <div className="max-w-md mx-auto">
              <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
            </div>
          </div>
        </section>

        {/* Second Featured Articles Section Skeleton - matches the paginated articles */}
        <section className="mb-6 md:mb-10">
          <div className="text-center mb-10 bg-gradient-to-r from-red-600 to-pink-600 p-4 md:p-8">
            <Skeleton className="h-10 w-64 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>

          {/* Paginated Articles Grid - matches the exact grid structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden h-full flex flex-col">
                {/* Article Image Skeleton */}
                <div className="relative overflow-hidden h-40 flex-shrink-0">
                  <Skeleton className="w-full h-full bg-gray-200" />
                  <div className="absolute top-2 left-2 z-10">
                    <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />
                  </div>
                </div>

                {/* Article Content Skeleton */}
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-12 w-full bg-gray-200" />
                  <div className="flex items-center justify-between text-xs">
                    <Skeleton className="h-3 w-12 bg-gray-200" />
                    <Skeleton className="h-3 w-12 bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pagination Section Skeleton - matches the pagination structure */}
        <section className="pb-6 md:pb-10">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              {/* Previous Button Skeleton */}
              <Skeleton className="h-10 w-20 bg-gray-200 rounded" />
              
              {/* Page Numbers Skeleton */}
              <Skeleton className="h-10 w-10 bg-gray-200 rounded" />
              <Skeleton className="h-10 w-10 bg-gray-300 rounded" />
              <Skeleton className="h-10 w-10 bg-gray-200 rounded" />
              <Skeleton className="h-10 w-10 bg-gray-200 rounded" />
              
              {/* Next Button Skeleton */}
              <Skeleton className="h-10 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
