import { Skeleton } from "@/components/ui/skeleton";

export function ConfirmEmailSkeleton() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="text-center">
          <Skeleton className="h-12 w-12 mx-auto rounded-full" />
          <Skeleton className="h-6 w-48 mx-auto mt-4" />
          <Skeleton className="h-4 w-64 mx-auto mt-2" />
          <Skeleton className="h-10 w-32 mx-auto mt-6" />
        </div>
      </div>
    </div>
  );
}

