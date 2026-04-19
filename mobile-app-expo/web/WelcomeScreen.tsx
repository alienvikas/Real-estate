import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function WelcomeScreen() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <h1 className="welcome-title">Welcome, {username}!</h1>
        <p className="welcome-subtitle">What would you like to do today?</p>

        <div className="welcome-options">
          <button
            className="welcome-option sell"
            onClick={() => navigate('/sell')}
          >
            <span className="welcome-option-icon">🏷️</span>
            <span className="welcome-option-label">Sell Property</span>
            <span className="welcome-option-desc">List your property for sale</span>
          </button>

          <button
            className="welcome-option rent"
            onClick={() => navigate('/rent')}
          >
            <span className="welcome-option-icon">🔑</span>
            <span className="welcome-option-label">Rent Property</span>
            <span className="welcome-option-desc">List your property for rent</span>
          </button>

          <button
            className="welcome-option browse"
            onClick={() => navigate('/home')}
          >
            <span className="welcome-option-icon">🔍</span>
            <span className="welcome-option-label">Browse Properties</span>
            <span className="welcome-option-desc">View all listed properties</span>
          </button>
        </div>

        <button className="welcome-logout" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
