import { Skeleton } from "@/components/ui/skeleton";

export function NewsletterSkeleton() {
  return (
    <section className="md:w-2/3 mx-auto px-3 bg-gradient-left-right p-8 md:p-12 text-center text-white shadow-xl">
      {/* Icon skeleton */}
      <div className="mb-6 flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>

      {/* Title and description */}
      <Skeleton className="h-9 w-64 mx-auto mb-4" />
      <Skeleton className="h-6 w-96 mx-auto mb-8 max-w-md" />

      {/* Form skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Skeleton className="h-12 w-full sm:flex-1" />
        <Skeleton className="h-12 w-full sm:w-1/3" />
      </div>

      {/* Privacy note skeleton */}
      <Skeleton className="h-4 w-64 mx-auto mt-4" />
    </section>
  );
}

