import { CookiePolicySkeleton } from "@/components/skeletons/CookiePolicySkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <div className="mb-8 md:mb-16">
        <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
          {/* Products Banner skeleton */}
          <Skeleton className="w-full h-[90px] rounded-md" />

          {/* Main content skeleton */}
          <CookiePolicySkeleton />

          {/* Products Banner skeleton - bottom */}
          <Skeleton className="w-full h-[240px] rounded-md" />
        </div>
      </div>
    </main>
  );
}

