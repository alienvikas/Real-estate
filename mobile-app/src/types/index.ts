export interface Property {
  id: string;
  title: string;
  description: string;
  price: {
    sale: number | null;
    rent: number | null;
  };
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  images: string[]; // Array of image URIs
  bhk: number;
  area: number; // in sq ft
  amenities: string[];
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial';
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  priceForSale: string;
  priceForRent: string;
  address: string;
  latitude: number;
  longitude: number;
  bhk: string;
  area: string;
  amenities: string[];
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial';
  images: string[];
}

export interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
}
