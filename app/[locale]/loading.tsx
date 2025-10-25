import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <div className="flex flex-col h-full gap-8 md:gap-16">
        {/* Hero Section Skeleton - matches Home.tsx exactly */}
        <section className="relative w-full h-[70vh] min-h-[500px] mt-8 md:mt-16">
          <Skeleton className="w-full h-full bg-gray-200" />
          
          {/* Hero Content Skeleton - matches the text structure */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-6">
              <Skeleton className="h-16 w-96 mx-auto bg-white/30 mb-6" />
              <Skeleton className="h-8 w-80 mx-auto bg-white/20 mb-8" />
              <Skeleton className="h-6 w-72 mx-auto bg-white/20 mb-10" />
            </div>
          </div>
        </section>

        {/* Featured Articles Section Skeleton - matches FeaturedArticles component */}
        <section>
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <Skeleton className="h-10 w-64 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>

          {/* Featured Articles Grid - matches the exact grid structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="bg-white overflow-hidden h-full flex flex-col ">
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

        {/* Category Carousels Section - matches the structure */}
        <section>
          <div className="text-center mb-10 bg-gradient-left-right p-4 md:p-8">
            <Skeleton className="h-10 w-80 mx-auto bg-white/20 mb-4" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>

          {/* Category Carousels - simplified to match actual structure */}
          {Array.from({ length: 11 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6 px-6">
                <Skeleton className="h-8 w-32 bg-gray-200" />
                <Skeleton className="h-4 w-16 bg-gray-200" />
              </div>

              {/* Carousel Skeleton - horizontal scroll */}
              <div className="relative sm:px-6 md:px-12">
                <div className="flex gap-4 overflow-hidden boder-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-64">
                      <div className="bg-white overflow-hidden h-full flex flex-col">
                        <Skeleton className="w-full h-40 bg-gray-200" />
                        <div className="p-3 flex-1 flex flex-col gap-3">
                          <Skeleton className="h-4 w-full bg-gray-200" />
                          <Skeleton className="h-12 w-full bg-gray-200" />
                          <div className="flex items-center justify-between text-xs">
                            <Skeleton className="h-3 w-12 bg-gray-200" />
                            <Skeleton className="h-3 w-12 bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
