import React from 'react';
import { PropertyProvider } from './src/context/PropertyContext';
import { Navigation } from './src/navigation/Navigation';

export default function App() {
  return (
    <PropertyProvider>
      <Navigation />
    </PropertyProvider>
  );
}
