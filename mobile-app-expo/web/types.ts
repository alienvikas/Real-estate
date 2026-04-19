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
  images: string[];
  bhk: number;
  area: number;
  apartmentName: string;
  floor: string;
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
  apartmentName: string;
  floor: string;
  amenities: string[];
  propertyType: 'apartment' | 'house' | 'villa' | 'commercial';
  images: string[];
}
