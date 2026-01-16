import React, { useMemo, useRef, useCallback } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, ComposedChart,
  ReferenceDot
} from 'recharts';
import { formatPrice, formatDate, formatShortDate } from '../../utils/formatters';

const TIMEFRAMES = [
  { key: '1d', label: '1j', days: 1 },
  { key: '5d', label: '5j', days: 5 },
  { key: '1m', label: '1m', days: 30 },
  { key: '3m', label: '3m', days: 90 },
  { key: '6m', label: '6m', days: 180 },
  { key: '1y', label: '1a', days: 365 },
];

const EnhancedPriceChart = ({ historyData, loading, timeframe, onTimeframeChange, onRefresh }) => {
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    const selectedDays = TIMEFRAMES.find(t => t.key === timeframe)?.days || 5;
    const filteredData = historyData.slice(0, Math.min(selectedDays, historyData.length));

    return filteredData.map(item => ({
      date: formatShortDate(item.date),
      fullDate: formatDate(item.date),
      price: parseFloat(item.price_per_gram_mad.toFixed(2))
    })).reverse();
  }, [historyData, timeframe]);

  const { minPrice, maxPrice, minPoint, maxPoint } = useMemo(() => {
    if (chartData.length === 0) return { minPrice: 0, maxPrice: 0, minPoint: null, maxPoint: null };

    const prices = chartData.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.15 || 10;

    const minIdx = prices.indexOf(min);
    const maxIdx = prices.indexOf(max);

    return {
      minPrice: Math.floor(min - padding),
      maxPrice: Math.ceil(max + padding),
      minPoint: chartData[minIdx],
      maxPoint: chartData[maxIdx]
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xl">
          <p className="text-gray-500 text-xs mb-1 font-medium">
            {payload[0].payload.fullDate}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#002FA7] font-bold text-xl">
              {formatPrice(payload[0].value)}
            </span>
            <span className="text-gray-400 text-xs">MAD/g</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const exportToPNG = useCallback(() => {
    const svgElement = chartRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = svgElement.clientWidth * 2;
    canvas.height = svgElement.clientHeight * 2;

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = `18k-ma-prix-or-${timeframe}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  }, [timeframe]);

  const exportToCSV = useCallback(() => {
    if (chartData.length === 0) return;

    const headers = ['Date', 'Prix (MAD/g)'];
    const rows = chartData.map(d => [d.fullDate, d.price]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `18k-ma-prix-or-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [chartData, timeframe]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-36 bg-gray-100 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div className="h-[320px] w-full bg-gray-50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex items-center justify-center">
        <div className="text-gray-400 text-center py-12">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">Aucune donnée disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-[#002FA7] text-lg font-bold">Historique des Prix</h3>

        {/* Timeframe Filter */}
        <div className="flex gap-1.5">
          {TIMEFRAMES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onTimeframeChange(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                timeframe === key
                  ? 'bg-[#002FA7] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-grow relative min-h-[280px]" ref={chartRef}>
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="text-5xl lg:text-6xl font-extrabold text-[#002FA7] opacity-[0.04]">
            18k.ma
          </span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#002FA7" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#002FA7" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              interval="preserveStartEnd"
              dy={8}
            />

            <YAxis
              domain={[minPrice, maxPrice]}
              tick={{ fill: '#9ca3af', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString('fr-FR')}
              orientation="left"
              dx={-5}
              width={45}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#002FA7', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            <Area
              type="monotone"
              dataKey="price"
              fill="url(#priceGradient)"
              stroke="transparent"
              animationDuration={600}
              animationEasing="ease-out"
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#002FA7"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#002FA7',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              animationDuration={600}
              animationEasing="ease-out"
            />

            {/* Min Point */}
            {minPoint && chartData.length > 2 && (
              <ReferenceDot
                x={minPoint.date}
                y={minPoint.price}
                r={4}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}

            {/* Max Point */}
            {maxPoint && chartData.length > 2 && (
              <ReferenceDot
                x={maxPoint.date}
                y={maxPoint.price}
                r={4}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer: Legend + Refresh + Export */}
      <div className="flex items-center justify-between gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Max</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Min</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-[#002FA7] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>

          <span className="text-gray-200">|</span>

          {/* Export Buttons */}
          <button
            onClick={exportToPNG}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-[#002FA7] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            PNG
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-400 hover:text-[#002FA7] hover:bg-gray-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPriceChart;
