import React, { useState, useMemo } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, ComposedChart
} from 'recharts';
import { formatPrice, formatDate, formatShortDate } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';

const TIMEFRAMES = [
  { key: '1d', label: '1J', days: 1 },
  { key: '7d', label: '7J', days: 7 },
  { key: '14d', label: '14J', days: 14 },
  { key: '30d', label: '1M', days: 30 },
  { key: '90d', label: '3M', days: 90 },
  { key: '180d', label: '6M', days: 180 },
  { key: '365d', label: '1A', days: 365 },
  { key: 'all', label: 'Tout', days: 9999 },
];

const EnhancedPriceChart = ({ historyData, loading }) => {
  const [timeframe, setTimeframe] = useState('30d');

  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    const selectedDays = TIMEFRAMES.find(t => t.key === timeframe)?.days || 30;
    const filteredData = historyData.slice(0, Math.min(selectedDays, historyData.length));

    return filteredData.map(item => ({
      date: formatShortDate(item.date),
      fullDate: formatDate(item.date),
      price: parseFloat(item.price_per_gram_mad.toFixed(2))
    })).reverse();
  }, [historyData, timeframe]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 0 };
    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1 || 10;
    return {
      minPrice: Math.floor(min - padding),
      maxPrice: Math.ceil(max + padding)
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-terminal-card border border-gold-400 rounded-lg p-3 shadow-lg">
          <p className="text-terminal-muted text-xs mb-1">
            {payload[0].payload.fullDate}
          </p>
          <p className="text-gold-400 font-mono text-lg font-bold">
            {formatPrice(payload[0].value)} MAD/g
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card-terminal p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-[300px] lg:h-[400px] w-full" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card-terminal p-4 lg:p-6">
        <div className="text-terminal-muted text-center py-12">
          Aucune donnee disponible
        </div>
      </div>
    );
  }

  return (
    <div className="card-terminal p-4 lg:p-6">
      {/* Header with timeframe selector */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-terminal-muted text-sm font-semibold uppercase tracking-wider">
          Historique des Prix
        </h3>

        <div className="flex gap-1 bg-terminal-bg rounded-lg p-1">
          {TIMEFRAMES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeframe(key)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === key
                  ? 'bg-gold-400 text-white'
                  : 'text-terminal-muted hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#30363d"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: '#8b949e', fontSize: 11 }}
              axisLine={{ stroke: '#30363d' }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#8b949e', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString('fr-FR')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              fill="url(#goldGradient)"
              stroke="transparent"
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#C9A961"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#C9A961', stroke: '#0d1117', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnhancedPriceChart;
