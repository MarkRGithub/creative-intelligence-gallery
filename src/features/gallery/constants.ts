import type { AdData } from '@/shared/types/ad';
import { ZIP_CONSTANTS } from '@/lib/zip';
import type { SearchFilterType } from './types';

export interface SearchFilter {
  type: SearchFilterType;
  label: string;
  dataKey: keyof AdData;
}

export const SEARCH_FILTERS: SearchFilter[] = [
  { type: 'client', label: 'Client / Partner', dataKey: 'client' },
  { type: 'concept', label: 'Concept', dataKey: 'creative_name' },
  { type: 'format', label: 'Format', dataKey: 'formats' },
  { type: 'feature', label: 'Feature', dataKey: 'features' },
  { type: 'delivery', label: 'Delivery Type', dataKey: 'delivery_types' },
];

export const MAX_FILE_SIZE = ZIP_CONSTANTS.MAX_FILE_SIZE;
export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / 1024 / 1024;

export const ACCEPTED_FILE_TYPES = ['.zip', 'application/zip'] as const;
export const ACCEPTED_FILE_TYPES_STRING = '.zip';

export const ERROR_MESSAGES = {
  FILE_REQUIRED: 'Please select a file',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE_MB}MB`,
  FILE_TYPE_INVALID: `Please select a valid file type (${ACCEPTED_FILE_TYPES_STRING})`,
  CREATIVE_NAME_REQUIRED: 'Creative name is required',
  CLIENT_REQUIRED: 'Client name is required',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  UPLOAD_SUCCESS: 'Upload successful!',
} as const;
