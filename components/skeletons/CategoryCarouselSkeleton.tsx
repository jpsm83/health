import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCarouselSkeleton() {
  return (
    <div className="mb-12 cv-auto">
      <hr className="my-4 border-1 border-gray-200" />
      {/* Category Header */}
      <div className="flex items-center justify-between mb-6 px-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Carousel Skeleton */}
      <div className="relative sm:px-6 md:px-12 cv-auto">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 basis-64">
              <div className="bg-white shadow-sm overflow-hidden h-full flex flex-col">
                <Skeleton className="h-48 w-full" />
                <div className="p-3 flex-1 flex flex-col gap-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

