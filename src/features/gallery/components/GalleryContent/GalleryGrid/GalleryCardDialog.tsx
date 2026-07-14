// src/features/gallery/components/GalleryContent/GalleryGrid/GalleryCardDialog.tsx
import { Dialog, DialogContent } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { AdData } from '@/shared/types/ad';

interface GalleryCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adData: AdData;
}

export const GalleryCardDialog = ({
  open,
  onOpenChange,
  adData,
}: GalleryCardDialogProps) => {
  const formattedDate = new Date(adData.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-view w-[calc(100%-3rem)] lg:w-[calc(100%-7rem)] h-[95dvh] lg:h-auto lg:max-h-[38rem] p-0 overflow-hidden">
        <div className="flex h-full min-h-0 flex-col lg:grid lg:h-auto lg:grid-cols-[minmax(0,1fr)_clamp(24rem,30vw,28rem)] lg:grid-rows-[auto_1fr]">
          {/* Header */}
          <div className="shrink-0 px-6 pt-8 pb-6 lg:col-start-2 lg:row-start-1 lg:px-8 lg:pb-0">
            <div className="space-y-0.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#500088]">
                {adData.client}
              </h2>

              <h3 className="text-lg font-black lg:text-xl">{adData.creative_name}</h3>
            </div>
          </div>

          {/* Preview */}
          <div className="shrink-0 min-h-0 h-[40vh] lg:h-auto flex items-center justify-center bg-[#DAD6FF] p-6 lg:col-start-1 lg:row-span-2 lg:border-r lg:border-[#CFC2D4] lg:p-8">
            <img
              src={adData.thumbnail_path}
              alt={adData.creative_name}
              className="max-h-full max-w-full rounded-lg object-contain lg:max-h-[30rem]"
            />
          </div>

          {/* Details */}
          <div className="min-h-0 flex-1 overflow-y-auto lg:col-start-2 lg:row-start-2 lg:flex-none lg:overflow-visible">
            <div className="flex flex-col gap-4 px-6 py-6 lg:px-8">
              <div>
                <p className="text-[0.688rem] font-bold text-muted-emphasis uppercase tracking-wider">
                  Delivery Type
                </p>
                <p className="mt-0.5">{adData.delivery_types}</p>
              </div>

              <div>
                <p className="text-[0.688rem] font-bold text-muted-emphasis uppercase tracking-wider">
                  Format
                </p>
                <p className="mt-0.5">{adData.formats[0] || 'N/A'}</p>
              </div>

              <div>
                <p className="text-[0.688rem] font-bold text-muted-emphasis uppercase tracking-wider">
                  Features
                </p>
                <p className="mt-0.5">{adData.features.join(', ') || 'None'}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-[0.688rem] font-bold text-muted-emphasis uppercase tracking-wider">
                    Dynamic Elements
                  </p>
                  <p className="mt-0.5">36</p>
                </div>

                <div className="flex-1">
                  <p className="text-[0.688rem] font-bold text-muted-emphasis uppercase tracking-wider">
                    Updated Date
                  </p>
                  <p className="mt-0.5">{formattedDate}</p>
                </div>
              </div>

              <Button
                variant="tertiary"
                className="mt-4 h-14 w-full"
                onClick={() => window.open(adData.thumbnail_path, '_blank')}
              >
                Preview Full Creative
                <ExternalLink className="size-4.5" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
