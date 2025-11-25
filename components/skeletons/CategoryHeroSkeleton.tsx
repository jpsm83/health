import { Skeleton } from "@/components/ui/skeleton";

export function CategoryHeroSkeleton() {
  return (
    <section className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 flex items-center justify-center h-full mx-3">
        <div className="text-center w-full max-w-4xl mx-auto px-4 md:px-6 space-y-4">
          <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 md:h-8 w-5/6 mx-auto max-w-2xl" />
        </div>
      </div>
    </section>
  );
}

