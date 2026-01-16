import React from 'react';
import '../styles/PriceDisplay.css';

const PriceDisplay = ({ currentPrice }) => {
  if (!currentPrice) {
    return (
      <div className="price-display">
        <p className="loading-text">Chargement des données...</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatVariation = (variation) => {
    if (variation === null || variation === undefined) {
      return null;
    }
    const sign = variation >= 0 ? '+' : '';
    return `${sign}${variation.toFixed(2)} %`;
  };

  return (
    <div className="price-display">
      <div className="price-container">
        <h2 className="price-title">Cours de l'Or</h2>
        
        <div className="current-price-section">
          <div className="price-row">
            <span className="price-label">Prix actuel (1 gramme)</span>
            <span className="price-value">
              {formatPrice(currentPrice.price_per_gram_mad)} MAD
            </span>
          </div>
          
          {currentPrice.variation_24h !== null && (
            <div className="variation-row">
              <span className="variation-label">Variation 24H</span>
              <span className={`variation-value ${currentPrice.variation_24h >= 0 ? 'positive' : 'negative'}`}>
                {formatVariation(currentPrice.variation_24h)}
              </span>
            </div>
          )}
          
          <div className="date-row">
            <span className="date-label">Date de mise à jour</span>
            <span className="date-value">
              {new Date(currentPrice.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;

