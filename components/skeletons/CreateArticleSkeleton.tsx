import { Skeleton } from "@/components/ui/skeleton";

export function CreateArticleSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Form container skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Title field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Content field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Category field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Tags field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Images field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}

