import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from './PropertyContext';
import LocationPicker from './LocationPicker';

export default function PropertyDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById, deleteProperty } = useProperty();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const property = id ? getPropertyById(id) : null;

  if (!property) {
    return (
      <div className="container">
        <div className="header">
          <button className="back-button" onClick={() => navigate('/home')}>← Back</button>
          <h1 className="header-title">Not Found</h1>
          <div style={{ width: 60 }} />
        </div>
        <div className="content">
          <p>Property not found.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(property.id);
      navigate('/home');
    }
  };

  const prevImage = () => {
    setCurrentImageIndex(i => (i === 0 ? property.images.length - 1 : i - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex(i => (i === property.images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/home')}>← Back</button>
        <h1 className="header-title">Details</h1>
        <button className="delete-button" onClick={handleDelete}>🗑 Delete</button>
      </div>

      <div className="details-container">
        {/* Image Gallery */}
        {property.images.length > 0 ? (
          <div className="gallery">
            <img src={property.images[currentImageIndex]} alt={property.title} className="gallery-image" />
            {property.images.length > 1 && (
              <div className="gallery-controls">
                <button className="gallery-btn" onClick={prevImage}>‹</button>
                <span className="gallery-counter">{currentImageIndex + 1} / {property.images.length}</span>
                <button className="gallery-btn" onClick={nextImage}>›</button>
              </div>
            )}
          </div>
        ) : (
          <div className="gallery-placeholder">🏠 No Images</div>
        )}

        {/* Title & Type */}
        <div className="details-section">
          <div className="details-header-row">
            <h2 className="details-title">{property.title}</h2>
            <span className="details-type-badge">
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </span>
          </div>
          <p className="details-location">📍 {property.location.address || 'No address'}</p>
        </div>

        {/* Quick Info */}
        <div className="details-section">
          <div className="quick-info">
            <div className="info-item">
              <span className="info-icon">🛏</span>
              <span className="info-value">{property.bhk} BHK</span>
            </div>
            <div className="info-item">
              <span className="info-icon">📐</span>
              <span className="info-value">{property.area} sq ft</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🏗</span>
              <span className="info-value">{property.propertyType}</span>
            </div>
            {property.floor && (
              <div className="info-item">
                <span className="info-icon">🏢</span>
                <span className="info-value">{property.floor}</span>
              </div>
            )}
          </div>
          {property.apartmentName && (
            <p style={{ marginTop: 8, fontSize: 14, color: '#666' }}>🏠 {property.apartmentName}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="details-section">
          <h3 className="section-label">💰 Pricing</h3>
          <div className="pricing-cards">
            {property.price.sale && (
              <div className="pricing-card sale">
                <span className="pricing-label">For Sale</span>
                <span className="pricing-value">{formatPrice(property.price.sale)}</span>
              </div>
            )}
            {property.price.rent && (
              <div className="pricing-card rent">
                <span className="pricing-label">For Rent</span>
                <span className="pricing-value">{formatPrice(property.price.rent)}/mo</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="details-section">
          <h3 className="section-label">📝 Description</h3>
          <p className="details-description">{property.description}</p>
        </div>

        {/* Amenities */}
        {property.amenities.length > 0 && (
          <div className="details-section">
            <h3 className="section-label">✨ Amenities</h3>
            <div className="amenities-list">
              {property.amenities.map(amenity => (
                <span key={amenity} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}

        {/* Location Map */}
        {(property.location.latitude !== 0 || property.location.longitude !== 0) && (
          <div className="details-section">
            <h3 className="section-label">🗺 Location</h3>
            <LocationPicker
              latitude={property.location.latitude}
              longitude={property.location.longitude}
              onLocationChange={() => {}}
              readOnly={true}
              height={250}
            />
            <p className="coords-text" style={{ marginTop: 8 }}>
              Lat: {property.location.latitude.toFixed(6)}, Lng: {property.location.longitude.toFixed(6)}
            </p>
          </div>
        )}

        {/* Timestamps */}
        <div className="details-section timestamps">
          <p>Added: {new Date(property.createdAt).toLocaleDateString('en-IN', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}</p>
        </div>
      </div>
    </div>
  );
}
