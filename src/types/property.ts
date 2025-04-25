
export type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse';

export interface PropertyFormData {
  property_type: PropertyType;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  description: string;
  amenities: string[];
}

export interface PropertyImage {
  file: File;
  preview: string;
  description?: string;
}
