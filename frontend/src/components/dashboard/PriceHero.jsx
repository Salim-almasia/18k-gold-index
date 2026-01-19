import React from 'react';
import { formatPrice, formatVariation, formatDate } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';

const PriceHero = ({ currentPrice, loading }) => {
  if (loading || !currentPrice) {
    return (
      <div className="card-terminal p-6 lg:p-8 border-l-4 border-l-gold-400">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-14 w-64 mb-4" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  const variation = currentPrice.variation_24h;
  const isPositive = variation >= 0;

  return (
    <div className="card-terminal p-6 lg:p-8 border-l-4 border-l-gold-400">
      {/* Status indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-terminal-muted text-sm">Marché en direct</span>
      </div>

      {/* Main price */}
      <div className="mb-4">
        <span className="text-terminal-muted text-sm block mb-1">
          Or 24 Karats - Prix au gramme
        </span>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl lg:text-5xl font-mono font-bold text-gold-400">
            {formatPrice(currentPrice.price_per_gram_mad)}
          </span>
          <span className="text-xl text-terminal-muted">MAD</span>
        </div>
      </div>

      {/* Variation */}
      {variation !== null && variation !== undefined && (
        <div className="flex items-center gap-4 flex-wrap">
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg ${
            isPositive
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            <span className="text-lg">{isPositive ? '▲' : '▼'}</span>
            <span className="font-mono font-semibold">
              {formatVariation(variation)}
            </span>
          </div>
          <span className="text-terminal-muted text-sm">
            Variation 24H
          </span>
        </div>
      )}

      {/* Last update */}
      <div className="mt-6 pt-4 border-t border-terminal-border">
        <span className="text-terminal-muted text-xs">
          Dernière mise à jour : {formatDate(currentPrice.date)}
        </span>
      </div>
    </div>
  );
};

export default PriceHero;
