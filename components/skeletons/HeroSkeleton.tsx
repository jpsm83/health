import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="space-y-4">
      <Skeleton className="w-full h-[90px] rounded-md" />
      <div className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] overflow-hidden rounded-lg">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton className="h-12 md:h-16" />
            <Skeleton className="h-6 md:h-8" />
          </div>
        </div>
      </div>
    </section>
  );
}

