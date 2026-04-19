import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from './PropertyContext';
import PropertyCard from './PropertyCard';

export default function HomeScreen() {
  const { properties, loading } = useProperty();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="header-title">🏠 Real Estate</h1>
        </div>
        <div className="content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-left">
          <button className="back-button" onClick={() => navigate('/')}>← Home</button>
          <h1 className="header-title">🏠 Real Estate</h1>
        </div>
        <div className="header-actions">
          <button className="header-button" onClick={() => navigate('/add')}>
            + Add Property
          </button>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="content">
          <div className="emoji">🏠</div>
          <h2 className="empty-title">No Properties Yet</h2>
          <p className="empty-description">Add your first property to get started!</p>
          <button className="primary-button" onClick={() => navigate('/add')}>
            + Add Property
          </button>
        </div>
      ) : (
        <div className="property-list">
          <p className="list-count">{properties.length} {properties.length === 1 ? 'Property' : 'Properties'}</p>
          <div className="property-grid">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
