import AsyncStorage from '@react-native-async-storage/async-storage';
import { Property } from '../types';

const PROPERTIES_KEY = 'real_estate_properties';

export const storage = {
  async getProperties(): Promise<Property[]> {
    try {
      const data = await AsyncStorage.getItem(PROPERTIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  async addProperty(property: Property): Promise<void> {
    try {
      const properties = await this.getProperties();
      properties.push(property);
      await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  },

  async updateProperty(propertyId: string, updatedProperty: Property): Promise<void> {
    try {
      const properties = await this.getProperties();
      const index = properties.findIndex(p => p.id === propertyId);
      if (index !== -1) {
        properties[index] = updatedProperty;
        await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(properties));
      }
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  async deleteProperty(propertyId: string): Promise<void> {
    try {
      const properties = await this.getProperties();
      const filtered = properties.filter(p => p.id !== propertyId);
      await AsyncStorage.setItem(PROPERTIES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  async getPropertyById(propertyId: string): Promise<Property | null> {
    try {
      const properties = await this.getProperties();
      return properties.find(p => p.id === propertyId) || null;
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  },

  async clearAllProperties(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROPERTIES_KEY);
    } catch (error) {
      console.error('Error clearing properties:', error);
      throw error;
    }
  },
};
