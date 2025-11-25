import { ConfirmNewsletterSkeleton } from "@/components/skeletons/ConfirmNewsletterSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto mt-4 mb-8 md:mt-8 md:mb-16">
      <ConfirmNewsletterSkeleton />
    </main>
  );
}

