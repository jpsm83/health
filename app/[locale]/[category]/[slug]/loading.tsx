import { ArticleDetailSkeleton } from "@/components/skeletons/ArticleDetailSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <ArticleDetailSkeleton />
    </main>
  );
}
