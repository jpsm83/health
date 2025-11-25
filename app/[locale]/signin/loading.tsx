import { SignInSkeleton } from "@/components/skeletons/SignInSkeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <SignInSkeleton />
    </main>
  );
}

