import React, { useState, useMemo } from 'react';

const PriceInfo = ({ currentPrice, historyData, loading, selectedTimeframe = '5d' }) => {
  const [unit, setUnit] = useState('g');

  const getTimeframeDays = (tf) => {
    const map = { '1d': 1, '5d': 5, '1m': 30, '3m': 90, '6m': 180, '1y': 365 };
    return map[tf] || 5;
  };

  const getTimeframeLabel = (tf) => {
    const map = { '1d': '1 jour', '5d': '5 jours', '1m': '1 mois', '3m': '3 mois', '6m': '6 mois', '1y': '1 an' };
    return map[tf] || '5 jours';
  };

  // Calculate all statistics
  const stats = useMemo(() => {
    if (!currentPrice?.price_per_gram_mad || !historyData || historyData.length === 0) {
      return null;
    }

    const days = getTimeframeDays(selectedTimeframe);
    const periodData = historyData.slice(0, Math.min(days, historyData.length));

    const currentPriceValue = currentPrice.price_per_gram_mad;
    const comparisonPrice = periodData[periodData.length - 1]?.price_per_gram_mad || periodData[0]?.price_per_gram_mad;

    const prices = periodData.map(d => d.price_per_gram_mad);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const amplitude = maxPrice - minPrice;

    const diff = currentPriceValue - comparisonPrice;
    const percentage = comparisonPrice ? (diff / comparisonPrice) * 100 : 0;

    const multiplier = unit === 'kg' ? 1000 : 1;

    return {
      current: currentPriceValue * multiplier,
      variation: diff * multiplier,
      percentage,
      max: maxPrice * multiplier,
      min: minPrice * multiplier,
      avg: avgPrice * multiplier,
      amplitude: amplitude * multiplier,
      isPositive: diff >= 0
    };
  }, [currentPrice, historyData, selectedTimeframe, unit]);

  const formatPrice = (value) => {
    if (unit === 'kg' && value >= 1000) {
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value / 1000) + ' K';
    }
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-20 bg-gray-100 rounded"></div>
          <div className="h-10 w-32 bg-gray-100 rounded"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
            <div className="h-16 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
      {/* Unit & Price Row */}
      <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
        {/* Left: Unit Toggle */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">Unité</span>
          <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setUnit('g')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                unit === 'g'
                  ? 'bg-[#002FA7] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              g
            </button>
            <button
              onClick={() => setUnit('kg')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all ${
                unit === 'kg'
                  ? 'bg-[#002FA7] text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              kg
            </button>
          </div>
        </div>

        {/* Right: Price */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-2">Prix d'aujourd'hui</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#D2A24C]">
              {stats ? formatPrice(stats.current) : '—'}
            </span>
            <span className="text-sm text-gray-400 font-medium">MAD/{unit}</span>
          </div>
        </div>
      </div>

      {/* Variation Row */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold ${
          stats?.isPositive
            ? 'bg-emerald-50 text-emerald-600'
            : 'bg-red-50 text-red-600'
        }`}>
          {stats?.isPositive ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span>{stats ? `${stats.isPositive ? '+' : ''}${formatPrice(stats.variation)} MAD` : '—'}</span>
          <span className="text-xs opacity-75">
            ({stats ? `${stats.isPositive ? '+' : ''}${stats.percentage.toFixed(2)}%` : '—'})
          </span>
        </div>
        <span className="text-xs text-gray-400">sur {getTimeframeLabel(selectedTimeframe)}</span>
      </div>

      {/* Stats Grid - Compact */}
      <div className="grid grid-cols-2 gap-3 flex-grow">
        {/* Max */}
        <div className="bg-gray-50 rounded-lg p-3 relative group transition-colors hover:bg-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-gray-400 font-medium">Maximum</span>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-700">
              {stats ? formatPrice(stats.max) : '—'}
            </span>
            <span className="text-xs text-gray-400">MAD</span>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
            Prix le plus élevé sur la période
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>

        {/* Min */}
        <div className="bg-gray-50 rounded-lg p-3 relative group transition-colors hover:bg-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs text-gray-400 font-medium">Minimum</span>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-700">
              {stats ? formatPrice(stats.min) : '—'}
            </span>
            <span className="text-xs text-gray-400">MAD</span>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
            Prix le plus bas sur la période
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>

        {/* Écart */}
        <div className="bg-gray-50 rounded-lg p-3 relative group transition-colors hover:bg-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">Écart</span>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-700">
              {stats ? formatPrice(stats.amplitude) : '—'}
            </span>
            <span className="text-xs text-gray-400">MAD</span>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
            Différence entre max et min (volatilité)
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>

        {/* Average */}
        <div className="bg-gray-50 rounded-lg p-3 relative group transition-colors hover:bg-gray-100">
          <div className="flex items-center gap-1.5 mb-1">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">Moyenne</span>
            <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-700">
              {stats ? formatPrice(stats.avg) : '—'}
            </span>
            <span className="text-xs text-gray-400">MAD</span>
          </div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
            Prix moyen sur la période sélectionnée
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      </div>

      {/* Footer: Last Update & Disclaimer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Dernière mise à jour : <strong>{currentPrice ? formatDate(currentPrice.date) : '—'}</strong></span>
        </div>
        <p className="text-xs text-gray-400 italic">
          *Cours indicatif, susceptible d'ajustements selon les conditions du marché.
        </p>
      </div>
    </div>
  );
};

export default PriceInfo;
