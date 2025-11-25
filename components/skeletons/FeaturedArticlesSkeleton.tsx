import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedArticlesSkeleton() {
  return (
    <section className="cv-auto px-3 py-4 space-y-4 bg-white rounded shadow-sm">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 rounded" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </section>
  );
}

