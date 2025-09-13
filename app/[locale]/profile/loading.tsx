import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto">
      <div className="flex items-start justify-center py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full space-y-6 md:space-y-8 md:bg-white p-4 md:p-8 md:rounded-lg md:shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image Section Skeleton */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200" />
              </div>
            </div>

            {/* Header Info Skeleton */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1">
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2 bg-gray-200" />
                  <Skeleton className="h-4 w-64 mx-auto md:mx-0 mb-2 bg-gray-200" />
                  <Skeleton className="h-5 w-32 mx-auto md:mx-0 bg-gray-200" />
                </div>

                {/* Language Selector Skeleton */}
                <div className="relative flex items-center space-x-2">
                  <Skeleton className="h-4 w-24 bg-gray-200" />
                  <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
              </div>

              {/* Quick Stats Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Skeleton className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-200" />
                    <div className="min-w-0">
                      <Skeleton className="h-4 w-20 mb-1 bg-gray-200" />
                      <Skeleton className="h-3 w-16 bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Confirmation Request Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-10 w-48 bg-gray-200 rounded" />
            <Skeleton className="h-4 w-64 bg-gray-200" />
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6 md:space-y-8">
            {/* Personal Information Section Skeleton */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <Skeleton className="w-4 h-4 md:w-5 md:h-5 mr-2 bg-gray-200" />
                <Skeleton className="h-6 w-32 bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Skeleton className="h-4 w-20 mb-2 bg-gray-200" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2 bg-gray-200" />
                  <Skeleton className="h-10 w-full bg-gray-200 rounded" />
                </div>
              </div>
            </div>

            {/* Category Interests Section Skeleton */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <Skeleton className="w-4 h-4 md:w-5 md:h-5 mr-2 bg-gray-200" />
                <Skeleton className="h-6 w-40 bg-gray-200" />
              </div>

              {/* Newsletter Frequency Skeleton */}
              <div className="mb-4 md:mb-6">
                <Skeleton className="h-4 w-36 mb-2 bg-gray-200" />
                <Skeleton className="h-10 w-full bg-gray-200 rounded" />
              </div>

              {/* Categories Grid Skeleton */}
              <div className="mb-4 md:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="border border-gray-50 rounded-lg p-2 md:p-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-20 flex-1 bg-gray-200" />
                        <Skeleton className="h-4 w-4 rounded flex-shrink-0 ml-2 bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Section Skeleton */}
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <Skeleton className="w-4 h-4 md:w-5 md:h-5 mr-2 bg-gray-200" />
                <Skeleton className="h-6 w-20 bg-gray-200" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <Skeleton className="h-10 w-32 bg-gray-200 rounded" />
                  <Skeleton className="h-4 w-64 bg-gray-200" />
                </div>
              </div>
            </div>

            {/* Save Button Skeleton */}
            <div className="flex flex-col items-center md:items-end space-y-2">
              <Skeleton className="h-10 w-24 bg-gray-200 rounded" />
              <Skeleton className="h-4 w-48 bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
