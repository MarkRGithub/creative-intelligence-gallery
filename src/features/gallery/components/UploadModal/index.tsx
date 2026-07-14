import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import { UploadForm } from './UploadForm';
import { ERROR_MESSAGES } from '@/features/gallery/constants';
import type { UploadFormData, UploadModalProps } from '@/features/gallery/types';

export const UploadModal = ({
  open,
  onOpenChange,
  onUploadSuccess,
}: UploadModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: UploadFormData) => {
    try {
      setIsLoading(true);

      console.log('📤 Uploading:', {
        creativeName: data.creativeName,
        client: data.client,
        deliveryType: data.deliveryType,
        formats: data.formats,
        features: data.features,
        fileName: data.file?.name,
        fileSize: data.file ? `${(data.file.size / 1024).toFixed(0)} KB` : 'N/A',
        hasThumbnail: !!data.thumbnail,
      });

      // TODO: Replace with actual upload logic
      // 1. Upload ZIP file to storage
      // 2. Upload thumbnail to storage
      // 3. Create AdData record in database

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(ERROR_MESSAGES.UPLOAD_SUCCESS);
      onUploadSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(ERROR_MESSAGES.UPLOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[672px]">
        <DialogHeader className="-mx-4 -mt-4 border-b px-6 py-4">
          <DialogTitle className="text-lg font-black">Submit Your Creative</DialogTitle>
        </DialogHeader>
        <UploadForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
