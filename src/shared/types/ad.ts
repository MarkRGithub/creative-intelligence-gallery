export const DELIVERY_TYPES = [
  'Non-Trafficked',
  'In-Banner',
  'Pre-rendered',
  'Social',
  'VPaid',
] as const;

export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export interface AdData {
  id: number;
  creative_name: string;
  client: string;
  delivery_types: DeliveryType;
  formats: string[];
  features: string[];
  zip_path: string;
  thumbnail_path: string;
  created_at: string;
}
