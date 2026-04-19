import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from './types';

interface Props {
  property: Property;
}

export default function PropertyCard({ property }: Props) {
  const navigate = useNavigate();

  const formatPrice = (price: number | null, label: string) => {
    if (!price) return null;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr (${label})`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L (${label})`;
    return `₹${price.toLocaleString('en-IN')} (${label})`;
  };

  const salePrice = formatPrice(property.price.sale, 'Sale');
  const rentPrice = formatPrice(property.price.rent, 'Rent/mo');

  return (
    <div className="property-card" onClick={() => navigate(`/property/${property.id}`)}>
      <div className="card-image-container">
        {property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} className="card-image" />
        ) : (
          <div className="card-image-placeholder">🏠</div>
        )}
        <span className="card-type-badge">
          {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
        </span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{property.title}</h3>
        <p className="card-location">📍 {property.location.address || 'No address'}</p>
        <div className="card-details">
          <span className="card-detail">🛏 {property.bhk} BHK</span>
          <span className="card-detail">📐 {property.area} sq ft</span>
        </div>
        <div className="card-prices">
          {salePrice && <span className="card-price sale">{salePrice}</span>}
          {rentPrice && <span className="card-price rent">{rentPrice}</span>}
        </div>
      </div>
    </div>
  );
}
