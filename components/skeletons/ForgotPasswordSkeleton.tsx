import { Skeleton } from "@/components/ui/skeleton";

export function ForgotPasswordSkeleton() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {/* Form Container */}
        <div className="space-y-6">
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
        <div className="mt-6 text-center space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>

        <div className="mt-4 text-center">
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
}

