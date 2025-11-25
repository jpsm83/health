import { Skeleton } from "@/components/ui/skeleton";

export function ResetPasswordSkeleton() {
  return (
    <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        {/* Title and Subtitle */}
        <div>
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Form Container */}
        <div className="mt-8 space-y-6">
          {/* Error/Success Message Area */}
          <Skeleton className="h-20 w-full rounded-md" />

          {/* Password Fields */}
          <div className="space-y-4">
            {/* New Password Field */}
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-3 w-48 mt-2" />
            </div>

            {/* Confirm Password Field */}
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-3 w-56 mt-2" />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>

        <div className="text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
}

