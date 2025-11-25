import { Skeleton } from "@/components/ui/skeleton";

export function ForgotPasswordSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        {/* Title and Subtitle */}
        <div>
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Form Container */}
        <div className="mt-8 space-y-6">
          {/* Email Input Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48 mt-2" />
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

