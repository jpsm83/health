import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // Configuration - easily adjustable
  // Change these values to customize the number of skeleton containers displayed
  const CONTAINER_DISTRIBUTION = 2; // Number of content containers (matches Article.tsx)
  const SECTIONS_PER_CONTAINER = 2; // Average sections per container
  const PARAGRAPHS_PER_SECTION = 4; // Average paragraphs per section

  return (
    <main className="container mx-auto">
      <div className="flex flex-col h-full gap-8 md:gap-16 mt-8 md:mt-16">
        {/* Article Content in 4 Containers - matches Article.tsx exactly */}
        <div className="space-y-6 md:space-y-12">
          {Array.from({ length: CONTAINER_DISTRIBUTION }).map(
            (_, containerIndex) => (
              <div key={containerIndex}>
                {/* Newsletter Signup before the last container - matches Article.tsx */}
                {containerIndex === CONTAINER_DISTRIBUTION - 1 && (
                  <div className="mb-8 md:mb-18">
                    {/* Newsletter Signup Skeleton */}
                    <div className="bg-gray-50 py-16">
                      <div className="container mx-auto px-4 text-center">
                        <Skeleton className="h-12 w-80 mx-auto mb-4 bg-gray-200" />
                        <Skeleton className="h-6 w-96 mx-auto mb-8 bg-gray-200" />
                        <div className="max-w-md mx-auto">
                          <Skeleton className="h-12 w-full bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden text-justify">
                  {/* Container Image Skeleton - matches Article.tsx image structure */}
                  <div className="relative w-full h-[70vh] mb-8 md:mb-16">
                    <Skeleton className="w-full h-full bg-gray-200" />

                    {/* Overlay Header Skeleton for first container only - matches Article.tsx */}
                    {containerIndex === 0 && (
                      <div className="absolute inset-0 bg-gray-200 flex flex-col justify-center items-center text-center px-4">
                        {/* Main Title Skeleton */}
                        <Skeleton className="h-16 md:h-20 w-96 md:w-[600px] mx-auto bg-white/30 mb-6 md:mb-12" />

                        {/* Article Info Skeleton */}
                        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
                          <div className="flex flex-wrap items-center justify-center gap-4 mb-2 md:mb-0">
                            <Skeleton className="h-4 w-20 bg-white/20" />
                            <Skeleton className="h-4 w-24 bg-white/20" />
                            <Skeleton className="h-4 w-16 bg-white/20" />
                            <Skeleton className="h-4 w-16 bg-white/20" />
                          </div>
                          {/* Like Button Skeleton */}
                          <div className="flex justify-center items-center">
                            <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Container Content Skeleton - matches Article.tsx content structure */}
                  <div className="px-4 md:px-18">
                    {Array.from({ length: SECTIONS_PER_CONTAINER }).map(
                      (_, sectionIndex) => (
                        <section key={sectionIndex} className="mb-8 last:mb-0">
                          {/* Section Title Skeleton */}
                          <Skeleton className="h-8 md:h-10 w-3/4 mb-4 bg-gray-200" />

                          {/* Paragraphs Skeleton */}
                          <div className="space-y-4">
                            {Array.from({ length: PARAGRAPHS_PER_SECTION }).map(
                              (_, pIndex) => (
                                <Skeleton
                                  key={pIndex}
                                  className={`h-4 bg-gray-200 ${
                                    pIndex === 0
                                      ? "w-full"
                                      : pIndex === 1
                                      ? "w-5/6"
                                      : "w-4/5"
                                  }`}
                                />
                              )
                            )}
                          </div>
                        </section>
                      )
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Like Button at Bottom Skeleton - matches Article.tsx */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
              <Skeleton className="h-4 w-12 bg-gray-200" />
            </div>
          </div>

          {/* Category Carousels Skeleton - matches CategoryCarousel */}
          <section>
            <div className="text-center bg-gradient-to-r from-red-600 to-pink-600 p-4 md:p-8">
              <Skeleton className="h-8 w-64 mx-auto bg-white/20" />
            </div>

            {/* Category Carousel Skeleton */}
            <div className="py-8">
              <div className="flex space-x-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64">
                    <div className="bg-white overflow-hidden h-full flex flex-col">
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
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
