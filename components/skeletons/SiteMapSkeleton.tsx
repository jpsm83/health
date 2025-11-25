import { Skeleton } from "@/components/ui/skeleton";

export function SiteMapSkeleton() {
  return (
    <div className="max-w-6xl mx-auto mt-8 md:mt-16 mb-8 md:mb-16">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto max-w-2xl" />
      </div>

      {/* Main Navigation Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              <Skeleton className="w-5 h-5 mr-2 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* List Items */}
            <ul className="space-y-3">
              {Array.from({ length: 3 + (index % 3) }).map((_, itemIndex) => (
                <li key={itemIndex} className="flex items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 ml-2" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Note Skeleton */}
      <div className="text-center">
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  );
}

