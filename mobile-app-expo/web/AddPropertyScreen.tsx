import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProperty } from './PropertyContext';
import { PropertyFormData } from './types';
import LocationPicker from './LocationPicker';

const AMENITIES_OPTIONS = [
  'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
  'Power Backup', 'Lift', 'Club House', 'Children Play Area', 'WiFi',
];

const initialForm: PropertyFormData = {
  title: '',
  description: '',
  priceForSale: '',
  priceForRent: '',
  address: '',
  latitude: 0,
  longitude: 0,
  bhk: '',
  area: '',
  apartmentName: '',
  floor: '',
  amenities: [],
  propertyType: 'apartment',
  images: [],
};

export default function AddPropertyScreen() {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const [form, setForm] = useState<PropertyFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProperty } = useProperty();
  const navigate = useNavigate();

  const updateField = (field: keyof PropertyFormData, value: string | number | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data.display_name) {
        setForm(prev => ({ ...prev, address: data.display_name }));
      }
    } catch {
      // silently fail — user can enter address manually
    }
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
      await reverseGeocode(lat, lng);
    } catch (err: any) {
      const msg = err?.code === 1
        ? 'Location permission denied. Please allow location access in your browser.'
        : 'Could not get exact location. Please click on the map to pin your location.';
      alert(msg);
    }
    setGettingLocation(false);
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
    reverseGeocode(lat, lng);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.priceForSale && !form.priceForRent) newErrors.price = 'At least one price is required';
    if (!form.bhk) newErrors.bhk = 'BHK is required';
    if (!form.area) newErrors.area = 'Area is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    addProperty(form);
    navigate('/home');
  };

  const headerTitle = intent === 'sell' ? 'Sell Property' : intent === 'rent' ? 'Rent Property' : 'Add Property';

  return (
    <div className="container">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <h1 className="header-title">{headerTitle}</h1>
        <div style={{ width: 60 }} />
      </div>

      {intent && (
        <div className={`intent-banner ${intent}`}>
          {intent === 'sell' ? '🏷️ Listing property for sale' : '🔑 Listing property for rent'}
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        {/* Basic Details */}
        <section className="form-section">
          <h2 className="section-title">📋 Basic Details</h2>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={form.title} onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. Beautiful 3BHK Apartment" />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)}
              placeholder="Describe the property..." rows={3} />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
        </section>

        {/* Property Type */}
        <section className="form-section">
          <h2 className="section-title">🏗 Property Type</h2>
          <div className="type-buttons">
            {(['apartment', 'house', 'villa', 'commercial'] as const).map(type => (
              <button key={type} type="button"
                className={`type-btn ${form.propertyType === type ? 'active' : ''}`}
                onClick={() => updateField('propertyType', type)}>
                {type === 'apartment' ? '🏢' : type === 'house' ? '🏠' : type === 'villa' ? '🏡' : '🏪'}
                {' '}{type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="form-row">
            <div className="form-group half">
              <label>BHK *</label>
              <input type="number" min="1" max="10" value={form.bhk}
                onChange={e => updateField('bhk', e.target.value)} placeholder="e.g. 3" />
              {errors.bhk && <span className="error">{errors.bhk}</span>}
            </div>
            <div className="form-group half">
              <label>Area (sq ft) *</label>
              <input type="number" min="1" value={form.area}
                onChange={e => updateField('area', e.target.value)} placeholder="e.g. 1200" />
              {errors.area && <span className="error">{errors.area}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group half">
              <label>Apartment / Building Name</label>
              <input type="text" value={form.apartmentName}
                onChange={e => updateField('apartmentName', e.target.value)} placeholder="e.g. Sunshine Residency" />
            </div>
            <div className="form-group half">
              <label>Floor</label>
              <input type="text" value={form.floor}
                onChange={e => updateField('floor', e.target.value)} placeholder="e.g. 5th Floor" />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="form-section">
          <h2 className="section-title">💰 Pricing</h2>
          {errors.price && <span className="error">{errors.price}</span>}
          <div className="form-row">
            <div className="form-group half">
              <label>Sale Price (₹)</label>
              <input type="number" min="0" value={form.priceForSale}
                onChange={e => updateField('priceForSale', e.target.value)} placeholder="e.g. 5000000" />
            </div>
            <div className="form-group half">
              <label>Rent (₹/month)</label>
              <input type="number" min="0" value={form.priceForRent}
                onChange={e => updateField('priceForRent', e.target.value)} placeholder="e.g. 25000" />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="form-section">
          <h2 className="section-title">📷 Images</h2>
          <div className="image-upload-area">
            <input ref={fileInputRef} type="file" accept="image/*" multiple
              onChange={handleImageUpload} style={{ display: 'none' }} />
            <button type="button" className="upload-btn"
              onClick={() => fileInputRef.current?.click()}>
              📁 Choose Images
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="image-preview-grid">
              {form.images.map((img, idx) => (
                <div key={idx} className="image-preview-item">
                  <img src={img} alt={`Preview ${idx + 1}`} />
                  <button type="button" className="remove-image-btn" onClick={() => removeImage(idx)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Location */}
        <section className="form-section">
          <h2 className="section-title">📍 Location</h2>
          <div className="form-group">
            <label>Address *</label>
            <input type="text" value={form.address}
              onChange={e => updateField('address', e.target.value)} placeholder="e.g. 123 Main St, Mumbai" />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          <button type="button" className="location-btn" onClick={getCurrentLocation}
            disabled={gettingLocation}>
            {gettingLocation ? '⏳ Getting location...' : '📍 Get Current Location'}
          </button>
          <LocationPicker
            latitude={form.latitude}
            longitude={form.longitude}
            onLocationChange={handleMapLocationChange}
          />
          {(form.latitude !== 0 || form.longitude !== 0) && (
            <p className="coords-display">
              Lat: {form.latitude.toFixed(6)}, Lng: {form.longitude.toFixed(6)}
            </p>
          )}
          <div className="form-row">
            <div className="form-group half">
              <label>Latitude</label>
              <input type="number" step="any" value={form.latitude || ''}
                onChange={e => updateField('latitude', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="form-group half">
              <label>Longitude</label>
              <input type="number" step="any" value={form.longitude || ''}
                onChange={e => updateField('longitude', parseFloat(e.target.value) || 0)} />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="form-section">
          <h2 className="section-title">✨ Amenities</h2>
          <div className="amenities-grid">
            {AMENITIES_OPTIONS.map(amenity => (
              <button key={amenity} type="button"
                className={`amenity-chip ${form.amenities.includes(amenity) ? 'active' : ''}`}
                onClick={() => toggleAmenity(amenity)}>
                {amenity}
              </button>
            ))}
          </div>
        </section>

        <button type="submit" className="submit-button">
          ✅ Add Property
        </button>
      </form>
    </div>
  );
}
