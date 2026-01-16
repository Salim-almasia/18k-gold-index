import React from 'react';
import { useKaratCalculations } from '../../hooks/useKaratCalculations';
import { formatPrice, formatVariation } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';

const KaratCard = ({ label, shortLabel, description, price, variation }) => {
  const isPositive = variation >= 0;

  return (
    <div className="card-terminal p-4 lg:p-6 hover:border-gold-400/50 transition-colors">
      {/* Karat Label */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-gold-400 font-mono text-sm font-semibold">
          {label}
        </span>
        <span className="text-terminal-muted text-xs">
          {description}
        </span>
      </div>

      {/* Price */}
      <div className="mb-3">
        <span className="text-2xl lg:text-3xl font-mono font-bold text-white">
          {formatPrice(price)}
        </span>
        <span className="text-terminal-muted text-sm ml-2">MAD/g</span>
      </div>

      {/* Variation */}
      {variation !== null && variation !== undefined && (
        <div className={`inline-flex items-center ${
          isPositive ? 'price-positive' : 'price-negative'
        }`}>
          <span className="mr-1">{isPositive ? '▲' : '▼'}</span>
          <span className="font-mono text-sm">{formatVariation(variation)}</span>
        </div>
      )}
    </div>
  );
};

const KaratPriceGrid = ({ currentPrice, loading }) => {
  const karatPrices = useKaratCalculations(
    currentPrice?.price_per_gram_mad,
    currentPrice?.variation_24h
  );

  if (loading || !karatPrices) {
    return (
      <div className="space-y-3">
        <h3 className="text-terminal-muted text-sm font-semibold uppercase tracking-wider">
          Prix par Carat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[24, 21, 18].map((k) => (
            <div key={k} className="card-terminal p-6">
              <Skeleton className="h-4 w-20 mb-4" />
              <Skeleton className="h-8 w-32 mb-3" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-terminal-muted text-sm font-semibold uppercase tracking-wider">
        Prix par Carat
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[24, 21, 18].map((karat) => (
          <KaratCard
            key={karat}
            {...karatPrices[karat]}
          />
        ))}
      </div>
    </div>
  );
};

export default KaratPriceGrid;
