import { Property } from './types';

const STORAGE_KEY = 'real_estate_properties';

export const storage = {
  getProperties(): Property[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveProperties(properties: Property[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  },

  addProperty(property: Property): void {
    const properties = this.getProperties();
    properties.push(property);
    this.saveProperties(properties);
  },

  updateProperty(id: string, updated: Property): void {
    const properties = this.getProperties();
    const idx = properties.findIndex(p => p.id === id);
    if (idx !== -1) {
      properties[idx] = updated;
      this.saveProperties(properties);
    }
  },

  deleteProperty(id: string): void {
    const properties = this.getProperties().filter(p => p.id !== id);
    this.saveProperties(properties);
  },

  getPropertyById(id: string): Property | null {
    return this.getProperties().find(p => p.id === id) || null;
  },
};
