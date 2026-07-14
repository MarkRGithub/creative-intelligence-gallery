import { useState } from 'react';
import type { AdData } from '@/shared/types/ad';
import { GalleryCardDialog } from './GalleryCardDialog';

interface GalleryCardProps {
  item: AdData;
}

export const GalleryCard = ({ item }: GalleryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        {/* Card content */}
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={item.thumbnail_path}
            alt={item.creative_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 text-xs flex flex-col gap-1">
          <h3 className="font-bold text-sm line-clamp-1 truncate">
            {item.creative_name}
          </h3>
          <p className="truncate text-muted-emphasis">{item.client}</p>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {item.features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="px-1.5 py-0.5 font-bold uppercase text-[0.625rem] text-chips-foreground bg-chips-card rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
      <GalleryCardDialog open={isOpen} onOpenChange={setIsOpen} adData={item} />
    </>
  );
};
