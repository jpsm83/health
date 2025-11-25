import { Skeleton } from "@/components/ui/skeleton";

export function SignInSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        {/* Title and Subtitle */}
        <div>
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Google Sign In Button */}
        <div className="mt-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-4 w-8 mx-2" />
          <Skeleton className="h-px w-full" />
        </div>

        {/* Form Container */}
        <div className="space-y-4">
          {/* Email Input Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Input Field */}
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Submit Button */}
          <div>
            <Skeleton className="h-10 w-full rounded-md mt-6" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </div>
  );
}

