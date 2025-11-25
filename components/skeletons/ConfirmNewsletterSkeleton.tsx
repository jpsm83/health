import { Skeleton } from "@/components/ui/skeleton";

export function ConfirmNewsletterSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  );
}

