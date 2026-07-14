import { Skeleton } from '@/shared/components/ui/skeleton';

export const GalleryCardSkeleton = () => {
  return (
    <div className="group relative bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[4/3] bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex flex-col gap-1">
        <Skeleton className="h-5 w-3/4" /> {/* Title */}
        <Skeleton className="h-4 w-1/2" /> {/* Client */}
        <div className="flex flex-wrap gap-1 mt-0.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
};
