import { Skeleton } from "@/components/ui/skeleton";

export function HeroSkeleton() {
  return (
    <section className="space-y-4">
      {/* Banner skeleton - matches ProductsBanner 970x90 */}
      <Skeleton className="w-full h-[90px] rounded-md" />
      {/* Hero section skeleton - matches HeroSection dimensions exactly */}
      <div className="relative w-full h-[55vh] min-h-[360px] md:h-[70vh] md:min-h-[500px] cv-auto">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex items-center justify-center h-full mx-3">
          <div className="text-center w-full max-w-4xl mx-auto px-4 md:px-6 space-y-4">
            {/* Title skeleton - matches h1 text-5xl md:text-6xl */}
            <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
            {/* Subtitle skeleton - matches p text-xl md:text-2xl */}
            <Skeleton className="h-6 md:h-8 w-5/6 mx-auto max-w-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

