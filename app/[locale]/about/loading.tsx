import { AboutHeroSkeleton } from "@/components/skeletons/AboutHeroSkeleton";
import { AboutContentSkeleton } from "@/components/skeletons/AboutContentSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <div className="mb-8 md:mb-16">
        <div className="flex flex-col h-full gap-8 md:gap-16 my-4 md:my-8">
          <AboutHeroSkeleton />
          <AboutContentSkeleton />
        </div>
      </div>
    </main>
  );
}

