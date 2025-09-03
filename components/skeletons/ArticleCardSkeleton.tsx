import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleCardSkeleton() {
  return (
    <div className="overflow-hidden h-full flex flex-col">
      {/* Article Image */}
      <div className="relative overflow-hidden h-40 flex-shrink-0">
        <Skeleton className="w-full h-full bg-gray-200" />
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Article Content */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        {/* Title and Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md bg-gray-200" />
          <Skeleton className="h-12 w-full rounded-md bg-gray-200" />
        </div>

        {/* Meta Information */}
          <div className="flex items-center justify-between ">
            <Skeleton className="h-3 w-12 rounded-sm bg-gray-200" />
            <Skeleton className="h-3 w-12 rounded-sm bg-gray-200" />
          </div>
        </div>
    </div>
  );
}
