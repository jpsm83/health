import { Skeleton } from "@/components/ui/skeleton";

export function AboutContentSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16">
        <Skeleton className="h-9 w-64 mb-6" />
        <Skeleton className="h-6 w-full mb-4" />
        <Skeleton className="h-6 w-full" />
      </div>
    </div>
  );
}

