import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Property, PropertyFormData } from '../types';
import { storage } from '../utils/storage';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (formData: PropertyFormData) => Promise<void>;
  updateProperty: (id: string, formData: PropertyFormData) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | null;
  refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await storage.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProperty = async (formData: PropertyFormData) => {
    try {
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
        bhk: parseInt(formData.bhk),
        area: parseFloat(formData.area),
        amenities: formData.amenities,
        propertyType: formData.propertyType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await storage.addProperty(newProperty);
      setProperties([...properties, newProperty]);
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const updateProperty = async (id: string, formData: PropertyFormData) => {
    try {
      const existingProperty = properties.find(p => p.id === id);
      if (!existingProperty) throw new Error('Property not found');

      const updatedProperty: Property = {
        ...existingProperty,
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
        bhk: parseInt(formData.bhk),
        area: parseFloat(formData.area),
        amenities: formData.amenities,
        propertyType: formData.propertyType,
        updatedAt: new Date().toISOString(),
      };

      await storage.updateProperty(id, updatedProperty);
      setProperties(properties.map(p => p.id === id ? updatedProperty : p));
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await storage.deleteProperty(id);
      setProperties(properties.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  const getPropertyById = (id: string): Property | null => {
    return properties.find(p => p.id === id) || null;
  };

  const refreshProperties = async () => {
    await loadProperties();
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      loading,
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertyById,
      refreshProperties,
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within PropertyProvider');
  }
  return context;
};
