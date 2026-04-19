import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Property, PropertyFormData } from './types';
import { storage } from './storage';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (formData: PropertyFormData) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | null;
  refreshProperties: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = () => {
    setLoading(true);
    const data = storage.getProperties();
    setProperties(data);
    setLoading(false);
  };

  const addProperty = (formData: PropertyFormData) => {
    const newProperty: Property = {
      id: uuidv4(),
      title: formData.title,
      description: formData.description,
      price: {
        sale: formData.priceForSale ? parseFloat(formData.priceForSale) : null,
        rent: formData.priceForRent ? parseFloat(formData.priceForRent) : null,
      },
      location: {
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
      },
      images: formData.images,
      bhk: parseInt(formData.bhk) || 0,
      area: parseFloat(formData.area) || 0,
      apartmentName: formData.apartmentName,
      floor: formData.floor,
      amenities: formData.amenities,
      propertyType: formData.propertyType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addProperty(newProperty);
    setProperties(prev => [...prev, newProperty]);
  };

  const deleteProperty = (id: string) => {
    storage.deleteProperty(id);
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const getPropertyById = (id: string): Property | null => {
    return properties.find(p => p.id === id) || null;
  };

  const refreshProperties = () => loadProperties();

  return (
    <PropertyContext.Provider value={{
      properties, loading, addProperty, deleteProperty, getPropertyById, refreshProperties,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperty must be used within PropertyProvider');
  return context;
};
