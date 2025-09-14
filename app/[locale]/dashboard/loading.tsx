import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Eye, Heart, MessageCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="space-y-6 m-6 md:m-12">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white shadow-md p-6 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 text-gray-300">
              {index === 0 && <BookOpen className="opacity-30" />}
              {index === 1 && <Eye className="opacity-30" />}
              {index === 2 && <Heart className="opacity-30" />}
              {index === 3 && <MessageCircle className="opacity-30" />}
            </div>
            <Skeleton className="h-6 w-24 mb-1 bg-gray-200" />
            <Skeleton className="h-8 w-16 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white shadow-md p-4">
        {/* Filter Controls */}
        <div className="flex gap-4 py-2 mb-4">
          <Skeleton className="h-10 w-full sm:max-w-sm bg-gray-200" />
          <Skeleton className="h-10 w-32 bg-gray-200" />
        </div>

        {/* Table Skeleton */}
        <div className="hidden md:block">
          <Skeleton className="h-96 w-full bg-gray-200" />
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full bg-gray-200" />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4">
          <Skeleton className="h-4 w-32 bg-gray-200" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 bg-gray-200" />
            <Skeleton className="h-8 w-16 bg-gray-200" />
          </div>
          <Skeleton className="h-10 w-40 bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
