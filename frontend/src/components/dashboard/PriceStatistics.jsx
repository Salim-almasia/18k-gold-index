import React, { useMemo } from 'react';
import { formatPrice } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';

const StatCard = ({ label, value, unit, highlight = false }) => (
  <div className={`p-3 rounded-lg ${highlight ? 'bg-gold-400/10' : 'bg-terminal-bg'}`}>
    <div className="text-terminal-muted text-xs uppercase mb-1">{label}</div>
    <div className="font-mono">
      <span className={`text-lg font-semibold ${highlight ? 'text-gold-400' : 'text-white'}`}>
        {value}
      </span>
      <span className="text-terminal-muted text-sm ml-1">{unit}</span>
    </div>
  </div>
);

const PriceStatistics = ({ historyData, loading }) => {
  const stats = useMemo(() => {
    if (!historyData || historyData.length === 0) return null;

    const prices = historyData.map(d => d.price_per_gram_mad);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const sum = prices.reduce((a, b) => a + b, 0);
    const avg = sum / prices.length;

    // Calculate volatility (standard deviation)
    const squaredDiffs = prices.map(p => Math.pow(p - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
    const stdDev = Math.sqrt(avgSquaredDiff);
    const volatility = (stdDev / avg) * 100;

    // Price change over period
    const firstPrice = prices[prices.length - 1]; // Oldest
    const lastPrice = prices[0]; // Most recent
    const periodChange = ((lastPrice - firstPrice) / firstPrice) * 100;

    return {
      min,
      max,
      avg,
      volatility,
      periodChange,
      dataPoints: prices.length,
    };
  }, [historyData]);

  if (loading) {
    return (
      <div className="card-terminal p-4 lg:p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card-terminal p-4 lg:p-6">
        <div className="text-terminal-muted text-center py-4">
          Donnees insuffisantes
        </div>
      </div>
    );
  }

  return (
    <div className="card-terminal p-4 lg:p-6">
      <h3 className="text-terminal-muted text-sm font-semibold uppercase tracking-wider mb-4">
        Statistiques ({stats.dataPoints} jours)
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          label="Minimum"
          value={formatPrice(stats.min)}
          unit="MAD"
        />
        <StatCard
          label="Maximum"
          value={formatPrice(stats.max)}
          unit="MAD"
        />
        <StatCard
          label="Moyenne"
          value={formatPrice(stats.avg)}
          unit="MAD"
          highlight
        />
        <StatCard
          label="Volatilite"
          value={stats.volatility.toFixed(2)}
          unit="%"
        />
        <StatCard
          label={`Variation ${stats.dataPoints}J`}
          value={(stats.periodChange >= 0 ? '+' : '') + stats.periodChange.toFixed(2)}
          unit="%"
        />
        <StatCard
          label="Points"
          value={stats.dataPoints}
          unit="jours"
        />
      </div>
    </div>
  );
};

export default PriceStatistics;
