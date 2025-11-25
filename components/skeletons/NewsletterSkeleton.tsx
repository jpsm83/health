import { Skeleton } from "@/components/ui/skeleton";

export function NewsletterSkeleton() {
  return (
    <section className="cv-auto px-4 py-8 bg-white rounded shadow-sm space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-72" />
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-12 w-full md:flex-1" />
        <Skeleton className="h-12 w-full md:w-40" />
      </div>
    </section>
  );
}

