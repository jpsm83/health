import { Skeleton } from "@/components/ui/skeleton";

export function AboutHeroSkeleton() {
  return (
    <div className="bg-gradient-left-right text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Skeleton className="h-12 w-96 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/20" />
        </div>
      </div>
    </div>
  );
}

