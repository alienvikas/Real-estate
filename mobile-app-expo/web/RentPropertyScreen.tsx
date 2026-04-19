import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from './PropertyContext';
import { PropertyFormData } from './types';
import LocationPicker from './LocationPicker';

const AMENITIES_OPTIONS = [
  'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security',
  'Power Backup', 'Lift', 'Club House', 'Children Play Area', 'WiFi',
];

const FURNISHING_OPTIONS = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];

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

export default function RentPropertyScreen() {
  const [form, setForm] = useState<PropertyFormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [step, setStep] = useState(1);
  const [furnishing, setFurnishing] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addProperty } = useProperty();
  const navigate = useNavigate();

  const totalSteps = 4;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') e.preventDefault();
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
      if (!form.priceForRent) newErrors.priceForRent = 'Monthly rent is required';
    }
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
    if (!form.priceForRent) newErrors.priceForRent = 'Monthly rent is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.title) setStep(1);
      else if (newErrors.priceForRent) setStep(2);
      else if (newErrors.address) setStep(3);
      return;
    }
    // Add furnishing info to description
    const desc = furnishing
      ? `${form.description}\n\nFurnishing: ${furnishing}`
      : form.description;
    addProperty({ ...form, description: desc });
    navigate('/home');
  };

  return (
    <div className="rent-screen">
      {/* Header */}
      <div className="rent-header">
        <button className="rent-back-btn" onClick={() => step > 1 ? prevStep() : navigate('/')}>
          ← {step > 1 ? 'Back' : 'Home'}
        </button>
        <h1 className="rent-header-title">🔑 Rent Property</h1>
        <span className="rent-step-indicator">Step {step}/{totalSteps}</span>
      </div>

      {/* Progress Bar */}
      <div className="rent-progress-bar">
        <div className="rent-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
      </div>

      {/* Step Labels */}
      <div className="rent-step-labels">
        {['Details', 'Rent & Terms', 'Location', 'Photos & Amenities'].map((label, i) => (
          <span key={i} className={`rent-step-label ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'done' : ''}`}>
            {i + 1 < step ? '✓' : i + 1} {label}
          </span>
        ))}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple
        onChange={handleImageUpload} style={{ display: 'none' }} />

      <div className="rent-form" onKeyDown={handleKeyDown}>
        {/* Step 1: Property Details */}
        <div className="rent-step-content" style={{ display: step === 1 ? 'block' : 'none' }}>
          <h2 className="rent-section-title">📋 Property Details</h2>
          <p className="rent-section-desc">Tell tenants about your property</p>

          <div className="form-group">
            <label>Property Title *</label>
            <input type="text" value={form.title} onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. Cozy 2BHK Near Metro Station" />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea value={form.description} onChange={e => updateField('description', e.target.value)}
              placeholder="Describe the property — furnishing, nearby facilities, restrictions if any..." rows={4} />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="rent-type-section">
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
                onChange={e => updateField('bhk', e.target.value)} placeholder="e.g. 2" />
              {errors.bhk && <span className="error">{errors.bhk}</span>}
            </div>
            <div className="form-group half">
              <label>Area (sq ft) *</label>
              <input type="number" min="1" value={form.area}
                onChange={e => updateField('area', e.target.value)} placeholder="e.g. 950" />
              {errors.area && <span className="error">{errors.area}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Apartment / Building Name</label>
              <input type="text" value={form.apartmentName}
                onChange={e => updateField('apartmentName', e.target.value)} placeholder="e.g. Greenview Towers" />
            </div>
            <div className="form-group half">
              <label>Floor</label>
              <input type="text" value={form.floor}
                onChange={e => updateField('floor', e.target.value)} placeholder="e.g. 3rd Floor" />
            </div>
          </div>
        </div>

        {/* Step 2: Rent & Terms */}
        <div className="rent-step-content" style={{ display: step === 2 ? 'block' : 'none' }}>
          <h2 className="rent-section-title">💰 Rent & Terms</h2>
          <p className="rent-section-desc">Set your monthly rent and rental terms</p>

          <div className="rent-price-card">
            <div className="rent-price-icon">🔑</div>
            <div className="form-group">
              <label>Monthly Rent (₹) *</label>
              <input type="number" min="0" value={form.priceForRent}
                className="rent-price-input"
                onChange={e => updateField('priceForRent', e.target.value)}
                placeholder="e.g. 25000" />
              {errors.priceForRent && <span className="error">{errors.priceForRent}</span>}
            </div>
            {form.priceForRent && (
              <div className="rent-price-preview">
                ₹ {Number(form.priceForRent).toLocaleString('en-IN')} / month
              </div>
            )}
          </div>

          <div className="rent-furnishing-section">
            <h3>🛋️ Furnishing Status</h3>
            <div className="rent-furnishing-options">
              {FURNISHING_OPTIONS.map(opt => (
                <button key={opt} type="button"
                  className={`rent-furnishing-btn ${furnishing === opt ? 'active' : ''}`}
                  onClick={() => setFurnishing(opt)}>
                  {opt === 'Fully Furnished' ? '🪑' : opt === 'Semi Furnished' ? '🛏️' : '📦'} {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="rent-tips">
            <h3>💡 Rental Tips</h3>
            <ul>
              <li>Mention if deposit amount is negotiable</li>
              <li>Specify preferred lease duration in description</li>
              <li>Mention if pets or bachelors are allowed</li>
              <li>Include maintenance charges if separate</li>
            </ul>
          </div>
        </div>

        {/* Step 3: Location */}
        <div className="rent-step-content" style={{ display: step === 3 ? 'block' : 'none' }}>
          <h2 className="rent-section-title">📍 Property Location</h2>
          <p className="rent-section-desc">Help tenants find your property easily</p>

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
        <div className="rent-step-content" style={{ display: step === 4 ? 'block' : 'none' }}>
          <h2 className="rent-section-title">📷 Photos & Amenities</h2>
          <p className="rent-section-desc">Show tenants what they'll get</p>

          <div className="rent-photo-section">
            <div className="image-upload-area">
              <button type="button" className="upload-btn"
                onClick={() => fileInputRef.current?.click()}>
                📁 Add Photos
              </button>
              <span className="rent-photo-hint">Add photos of rooms, kitchen, bathrooms, balcony</span>
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

          <div className="rent-amenities-section">
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
        <div className="rent-nav-buttons">
          {step > 1 && (
            <button type="button" className="rent-nav-btn rent-nav-prev" onClick={prevStep}>
              ← Previous
            </button>
          )}
          {step < totalSteps ? (
            <button type="button" className="rent-nav-btn rent-nav-next" onClick={nextStep}>
              Next Step →
            </button>
          ) : (
            <button type="button" className="rent-nav-btn rent-nav-submit" onClick={handleSubmit}>
              ✅ List for Rent
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
