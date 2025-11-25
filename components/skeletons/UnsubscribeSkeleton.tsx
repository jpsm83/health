import { Skeleton } from "@/components/ui/skeleton";

export function UnsubscribeSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header Section Skeleton */}
        <div className="text-center mb-6">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Content Section Skeleton */}
        <div className="text-center">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
      </div>
    </div>
  );
}

