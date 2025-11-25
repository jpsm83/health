import { Skeleton } from "@/components/ui/skeleton";

export function ConfirmEmailSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <Skeleton className="h-12 w-12 mx-auto rounded-full" />
            <Skeleton className="h-6 w-48 mx-auto mt-4" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
            <Skeleton className="h-10 w-32 mx-auto mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

