import { Skeleton } from "@/components/ui/skeleton";

export function CookiePolicySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      {/* Title skeleton */}
      <Skeleton className="h-9 w-64 mb-6" />

      {/* Introduction paragraphs */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Section 3 with subsections */}
        <section className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />

          {/* Subsections */}
          <div className="space-y-6 pl-4">
            <div className="space-y-3">
              <Skeleton className="h-7 w-72" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-7 w-60" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

