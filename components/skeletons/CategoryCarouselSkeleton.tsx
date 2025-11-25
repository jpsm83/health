import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCarouselSkeleton() {
  return (
    <div className="mb-8 space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-64 w-48 rounded" />
        ))}
      </div>
    </div>
  );
}

