import { Skeleton } from "@/components/ui/skeleton";

export function TermsConditionsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Title Skeleton */}
      <Skeleton className="h-9 w-64 mb-6" />

      {/* Terms of Use Section Skeleton */}
      <div className="mb-8">
        <div className="bg-purple-50 p-6 mb-6 shadow-md space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <ul className="list-disc pl-6 space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Content Sections Skeleton */}
      <div className="space-y-8">
        {/* Introduction Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <ol className="list-decimal pl-6 space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ol>
        </section>

        {/* Use of Sites Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <ol className="list-decimal pl-6 space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ol>
        </section>

        {/* Products Banner Skeleton (middle) */}
        <Skeleton className="w-full h-[90px] rounded-md" />

        {/* Age Limit Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Use of Discussion Forums Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <ol className="list-decimal pl-6 space-y-3">
            {Array.from({ length: 11 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ol>
        </section>

        {/* Use of Material Posted Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Privacy Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Products Banner Skeleton (middle) */}
        <Skeleton className="w-full h-[90px] rounded-md" />

        {/* Safety Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Information and Availability Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </section>

        {/* Links Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <ol className="list-decimal pl-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ol>
        </section>

        {/* General Section */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <ol className="list-decimal pl-6 space-y-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <li key={index}>
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ol>
        </section>

        {/* Warning Section */}
        <div className="bg-red-50 border-red-600 border-2 p-4 mt-8">
          <Skeleton className="h-6 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}

