import { Skeleton } from "@/components/ui/skeleton";

export function PrivacyPolicySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 space-y-8">
      {/* Title skeleton */}
      <Skeleton className="h-9 w-64 mb-6" />

      {/* Last updated and highlights */}
      <div className="mb-8 space-y-4">
        <Skeleton className="h-4 w-48" />
        <div className="bg-purple-50 p-6 mb-6 shadow-md space-y-3">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {/* Section 1 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-72" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-80" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <ul className="list-disc pl-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </section>

        {/* Section 8 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Section 9 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </section>

        {/* Section 10 */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </section>
      </div>
    </div>
  );
}

