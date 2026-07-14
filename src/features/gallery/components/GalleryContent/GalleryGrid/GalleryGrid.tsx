import type { AdData } from '@/shared/types/ad';
import { GalleryCard } from './GalleryCard';
import { GalleryCardSkeleton } from './GalleryCardSkeleton';
import { SearchX } from 'lucide-react';

interface GalleryGridProps {
  data: AdData[];
  isLoading?: boolean;
}

export const GalleryGrid = ({ data, isLoading = false }: GalleryGridProps) => {
  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <GalleryCardSkeleton key={`skeleton-${index}`} />
      ));
    }

    if (data.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <SearchX className="size-8 mb-0.5 text-muted-foreground/70" />
          <p className="text-sm lg:text-base font-semibold text-muted-foreground">
            No results found
          </p>
          <p className="text-xs lg:text-sm text-muted-foreground">
            Try adjusting your filters
          </p>
        </div>
      );
    }

    return data.map((item) => <GalleryCard key={item.id} item={item} />);
  };

  return (
    <section className="w-full px-6 pt-0 pb-6 lg:px-14 lg:pt-6 lg:pb-14">
      <div className="mx-auto max-w-view">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {renderContent()}
        </div>
      </div>
    </section>
  );
};
