import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import '../styles/PriceChart.css';

const PriceChart = ({ historyData }) => {
  if (!historyData || historyData.length === 0) {
    return (
      <div className="price-chart">
        <h3 className="chart-title">Historique des 30 derniers jours</h3>
        <p className="no-data-text">Aucune donnée historique disponible</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = historyData.map(item => ({
    date: new Date(item.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit'
    }),
    fullDate: new Date(item.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    price: parseFloat(item.price_per_gram_mad.toFixed(2))
  }));

  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisMin = Math.floor(minPrice - priceRange * 0.1);
  const yAxisMax = Math.ceil(maxPrice + priceRange * 0.1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.fullDate}</p>
          <p className="tooltip-price">
            {new Intl.NumberFormat('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(payload[0].value)} MAD / g
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="price-chart">
      <h3 className="chart-title">Historique des 30 derniers jours</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#666', fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[yAxisMin, yAxisMax]}
              tick={{ fill: '#666', fontSize: 12 }}
              label={{ value: 'Prix (MAD/g)', angle: -90, position: 'insideLeft', fill: '#666' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#C9A961"
              strokeWidth={3}
              dot={{ fill: '#C9A961', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;




