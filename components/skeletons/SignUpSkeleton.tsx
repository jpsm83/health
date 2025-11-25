import { Skeleton } from "@/components/ui/skeleton";

export function SignUpSkeleton() {
  return (
    <div className="flex-1 bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8 md:bg-white p-8 md:rounded-lg md:shadow-lg">
        {/* Title and Subtitle */}
        <div>
          <Skeleton className="h-9 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>

        {/* Google Sign Up Button */}
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
        <div className="mt-8 space-y-4">
          {/* Username Input Field */}
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Email Input Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Birth Date Input Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Password Input Field */}
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Confirm Password Input Field */}
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Image Upload Field */}
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
            {/* Image Preview Area */}
            <Skeleton className="h-24 w-24 mt-2 rounded-md" />
          </div>

          {/* Submit Button */}
          <div>
            <Skeleton className="h-10 w-full rounded-md mt-6" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="text-center">
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

