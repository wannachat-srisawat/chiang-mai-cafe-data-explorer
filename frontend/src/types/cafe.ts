export type PriceLevel = '$' | '$$' | '$$$' | '$$$$';

export type Cafe = {
  id: number;
  name: string;
  description: string;
  district: string;
  image_url?: string | null;
  lat: number | null;
  lng: number | null;
  rating?: number | null;
  price_level: string;
  vibe?: string;
  wifi?: boolean;
  quiet?: boolean;
  study_friendly?: boolean;
  nature?: boolean;
  created_at?: string;
  updated_at?: string;
};
