import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './web/AuthContext';
import { PropertyProvider } from './web/PropertyContext';
import LoginScreen from './web/LoginScreen';
import WelcomeScreen from './web/WelcomeScreen';
import HomeScreen from './web/HomeScreen';
import AddPropertyScreen from './web/AddPropertyScreen';
import SellPropertyScreen from './web/SellPropertyScreen';
import RentPropertyScreen from './web/RentPropertyScreen';
import PropertyDetailsScreen from './web/PropertyDetailsScreen';
import './styles/app.css';

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <PropertyProvider>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/sell" element={<SellPropertyScreen />} />
        <Route path="/rent" element={<RentPropertyScreen />} />
        <Route path="/add" element={<AddPropertyScreen />} />
        <Route path="/property/:id" element={<PropertyDetailsScreen />} />
      </Routes>
    </PropertyProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

