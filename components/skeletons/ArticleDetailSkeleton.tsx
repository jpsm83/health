import { Skeleton } from "@/components/ui/skeleton";

export function ArticleDetailSkeleton() {
  // Configuration - matches Article.tsx structure
  const CONTAINER_DISTRIBUTION = 4; // Number of content containers
  const SECTIONS_PER_CONTAINER = 2; // Average sections per container
  const PARAGRAPHS_PER_SECTION = 4; // Average paragraphs per section

  return (
    <div className="mb-8 md:mb-16">
      <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
        {/* Products Banner Skeleton */}
        <Skeleton className="w-full h-[90px] rounded-md" />

        {/* Article Content in 4 Containers */}
        <div className="space-y-6 md:space-y-12">
          {Array.from({ length: CONTAINER_DISTRIBUTION }).map(
            (_, containerIndex) => (
              <div key={containerIndex}>
                {/* Newsletter Signup before the last container */}
                {containerIndex === CONTAINER_DISTRIBUTION - 1 && (
                  <div className="mb-8 md:mb-18">
                    <div className="bg-gray-50 py-16">
                      <div className="container mx-auto px-4 text-center">
                        <Skeleton className="h-12 w-80 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto mb-8" />
                        <div className="max-w-md mx-auto">
                          <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-hidden text-justify">
                  {/* Container Image Skeleton */}
                  <div className="relative w-full h-[55vh] min-h-[320px] md:h-[70vh] md:min-h-[500px] mb-8 md:mb-16 flex">
                    <Skeleton className="w-full lg:w-1/2 h-full" />
                    <Skeleton className="hidden lg:block w-1/2 h-full" />

                    {/* Overlay Header Skeleton for first container only */}
                    {containerIndex === 0 && (
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                        <Skeleton className="h-16 md:h-20 w-96 md:w-[600px] mx-auto mb-6 md:mb-12 bg-white/30" />
                        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
                          <div className="flex flex-wrap items-center justify-center gap-4 mb-2 md:mb-0">
                            <Skeleton className="h-4 w-20 bg-white/20" />
                            <Skeleton className="h-4 w-24 bg-white/20" />
                            <Skeleton className="h-4 w-16 bg-white/20" />
                            <Skeleton className="h-4 w-16 bg-white/20" />
                            <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Container Content Skeleton */}
                  <div className="px-4 md:px-18">
                    {Array.from({ length: SECTIONS_PER_CONTAINER }).map(
                      (_, sectionIndex) => (
                        <section key={sectionIndex} className="mb-8 last:mb-0">
                          <Skeleton className="h-8 md:h-10 w-3/4 mb-4" />
                          <div className="space-y-4">
                            {Array.from({ length: PARAGRAPHS_PER_SECTION }).map(
                              (_, pIndex) => (
                                <Skeleton
                                  key={pIndex}
                                  className={`h-4 ${
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

          {/* Like Button at Bottom Skeleton */}
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>

          {/* Category Carousels Skeleton */}
          <section>
            <div className="text-center bg-gradient-left-right p-4 md:p-8">
              <Skeleton className="h-8 w-64 mx-auto bg-white/20" />
            </div>
            <div className="py-8">
              <div className="flex space-x-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-64">
                    <div className="bg-white overflow-hidden h-full flex flex-col">
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
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

