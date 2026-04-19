import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function SellPropertyScreen() {
  const [form, setForm] = useState<PropertyFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProperty } = useProperty();
  const navigate = useNavigate();

  const totalSteps = 4;

  // Prevent Enter key from triggering unwanted behavior
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

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
      // user can enter address manually
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

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!form.title.trim()) newErrors.title = 'Title is required';
      if (!form.description.trim()) newErrors.description = 'Description is required';
      if (!form.bhk) newErrors.bhk = 'BHK is required';
      if (!form.area) newErrors.area = 'Area is required';
    } else if (s === 2) {
      if (!form.priceForSale) newErrors.priceForSale = 'Sale price is required';
    }
    // Step 3 (location) and Step 4 (photos) have no required fields
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.priceForSale) newErrors.priceForSale = 'Sale price is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.title) setStep(1);
      else if (newErrors.priceForSale) setStep(2);
      else if (newErrors.address) setStep(3);
      return;
    }
    addProperty(form);
    navigate('/home');
  };

  return (
    <div className="sell-screen">
      {/* Header */}
      <div className="sell-header">
        <button className="sell-back-btn" onClick={() => step > 1 ? prevStep() : navigate('/')}>
          ← {step > 1 ? 'Back' : 'Home'}
        </button>
        <h1 className="sell-header-title">🏷️ Sell Property</h1>
        <span className="sell-step-indicator">Step {step}/{totalSteps}</span>
      </div>

      {/* Progress Bar */}
      <div className="sell-progress-bar">
        <div className="sell-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      {/* Step Labels */}
      <div className="sell-step-labels">
        {['Details', 'Pricing', 'Location', 'Photos & Amenities'].map((label, i) => (
          <span key={i} className={`sell-step-label ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}>
            {i + 1 < step ? '✓' : i + 1} {label}
          </span>
        ))}
      </div>

      {/* Hidden file input always in DOM so ref stays valid across steps */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple
        onChange={handleImageUpload} style={{ display: 'none' }} />

      <div className="sell-form" onKeyDown={handleKeyDown}>
        {/* Step 1: Property Details */}
        <div className="sell-step-content" style={{ display: step === 1 ? 'block' : 'none' }}>
            <h2 className="sell-section-title">📋 Property Details</h2>
            <p className="sell-section-desc">Tell buyers about your property</p>

            <div className="form-group">
              <label>Property Title *</label>
              <input type="text" value={form.title} onChange={e => updateField('title', e.target.value)}
                placeholder="e.g. Spacious 3BHK in Prime Location" />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea value={form.description} onChange={e => updateField('description', e.target.value)}
                placeholder="Describe what makes your property special — layout, views, nearby landmarks..." rows={4} />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            <div className="sell-type-section">
              <label>Property Type</label>
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
        </div>

        {/* Step 2: Pricing */}
        <div className="sell-step-content" style={{ display: step === 2 ? 'block' : 'none' }}>
            <h2 className="sell-section-title">💰 Set Your Price</h2>
            <p className="sell-section-desc">How much do you want to sell your property for?</p>

            <div className="sell-price-card">
              <div className="sell-price-icon">🏷️</div>
              <div className="form-group">
                <label>Asking Price (₹) *</label>
                <input type="number" min="0" value={form.priceForSale}
                  className="sell-price-input"
                  onChange={e => updateField('priceForSale', e.target.value)}
                  placeholder="e.g. 5000000" />
                {errors.priceForSale && <span className="error">{errors.priceForSale}</span>}
              </div>
              {form.priceForSale && (
                <div className="sell-price-preview">
                  ₹ {Number(form.priceForSale).toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <div className="sell-price-tips">
              <h3>💡 Pricing Tips</h3>
              <ul>
                <li>Research similar properties in your area</li>
                <li>Consider the current market trend</li>
                <li>Factor in the age and condition of the property</li>
                <li>Include registration and transfer charges info in description</li>
              </ul>
            </div>
        </div>

        {/* Step 3: Location */}
        <div className="sell-step-content" style={{ display: step === 3 ? 'block' : 'none' }}>
            <h2 className="sell-section-title">📍 Property Location</h2>
            <p className="sell-section-desc">Help buyers find your property easily</p>

            <div className="form-group">
              <label>Address *</label>
              <input type="text" value={form.address}
                onChange={e => updateField('address', e.target.value)}
                placeholder="e.g. 123 Main St, Mumbai" />
              {errors.address && <span className="error">{errors.address}</span>}
            </div>

            <button type="button" className="location-btn" onClick={getCurrentLocation}
              disabled={gettingLocation}>
              {gettingLocation ? '⏳ Getting location...' : '📍 Use My Current Location'}
            </button>

            {step >= 3 && (
              <LocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onLocationChange={handleMapLocationChange}
              />
            )}

            {(form.latitude !== 0 || form.longitude !== 0) && (
              <p className="coords-display">
                📌 Lat: {form.latitude.toFixed(6)}, Lng: {form.longitude.toFixed(6)}
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
        </div>

        {/* Step 4: Photos & Amenities */}
        <div className="sell-step-content" style={{ display: step === 4 ? 'block' : 'none' }}>
            <h2 className="sell-section-title">📷 Photos & Amenities</h2>
            <p className="sell-section-desc">Showcase your property to attract buyers</p>

            <div className="sell-photo-section">
              <div className="image-upload-area">
                <button type="button" className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}>
                  📁 Add Photos
                </button>
                <span className="sell-photo-hint">Add photos of rooms, exterior, views, amenities</span>
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
            </div>

            <div className="sell-amenities-section">
              <h3>✨ Select Amenities</h3>
              <div className="amenities-grid">
                {AMENITIES_OPTIONS.map(amenity => (
                  <button key={amenity} type="button"
                    className={`amenity-chip ${form.amenities.includes(amenity) ? 'active' : ''}`}
                    onClick={() => toggleAmenity(amenity)}>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* Navigation Buttons */}
        <div className="sell-nav-buttons">
          {step > 1 && (
            <button type="button" className="sell-nav-btn sell-nav-prev" onClick={prevStep}>
              ← Previous
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" className="sell-nav-btn sell-nav-next" onClick={nextStep}>
              Next Step →
            </button>
          ) : (
            <button type="button" className="sell-nav-btn sell-nav-submit" onClick={handleSubmit}>
              ✅ List for Sale
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
