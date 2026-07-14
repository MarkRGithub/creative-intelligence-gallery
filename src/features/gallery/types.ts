import type { AdData, DeliveryType } from '@/shared/types/ad';

export interface FilterState {
  formats: string[];
  features: string[];
  clients: string[];
  concepts: string[];
  deliveryTypes: DeliveryType[];
}

export interface FilterOptions {
  formats: string[];
  features: string[];
  clients: string[];
  concepts: string[];
  deliveryTypes: DeliveryType[];
}

export type ActiveFilter =
  | { type: 'search'; label: 'Search'; value: string }
  | { type: 'formats'; label: 'Format'; value: string }
  | { type: 'features'; label: 'Features'; value: string }
  | { type: 'clients'; label: 'Client'; value: string }
  | { type: 'concepts'; label: 'Concept'; value: string }
  | { type: 'deliveryTypes'; label: 'Delivery'; value: string };

export type NonSearchActiveFilter = Exclude<ActiveFilter, { type: 'search' }>;

export type SortOption = 'newest' | 'oldest';

export type SearchFilterType = 'client' | 'concept' | 'format' | 'feature' | 'delivery';

export type FilterRemoval =
  | { type: 'single'; filter: NonSearchActiveFilter }
  | { type: 'filter-type'; filterType: NonSearchActiveFilter['type'] }
  | { type: 'search' }
  | { type: 'all' };

export interface ZipThumbnailInfo {
  format: string | null;
  size: number | null;
  fileName: string | null;
  tooLarge: boolean;
}

export interface UploadFormData {
  file: File | null;
  creativeName: string;
  client: string;
  deliveryType: DeliveryType;
  formats: string[];
  features: string[];
  thumbnail: string | null;
}

export interface UploadFormErrors {
  file?: string;
  creativeName?: string;
  client?: string;
}

export interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

export interface UploadFormProps {
  onSubmit: (data: UploadFormData) => Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

export const formDataToAdData = (
  formData: UploadFormData,
  filePaths: { zipPath: string; previewPath: string },
): Omit<AdData, 'id' | 'created_at'> => {
  return {
    creative_name: formData.creativeName,
    client: formData.client,
    delivery_types: formData.deliveryType,
    formats: formData.formats,
    features: formData.features,
    zip_path: filePaths.zipPath,
    thumbnail_path: filePaths.previewPath,
  };
};
