import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import API_URL from './config';

// Context
import { ThemeProvider } from './context/ThemeContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard components
import PriceHero from './components/dashboard/PriceHero';
import KaratPriceGrid from './components/dashboard/KaratPriceGrid';
import CurrencyConverter from './components/dashboard/CurrencyConverter';
import PriceStatistics from './components/dashboard/PriceStatistics';
import EnhancedPriceChart from './components/dashboard/EnhancedPriceChart';

// Admin components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));

  useEffect(() => {
    fetchPriceData();
  }, []);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [currentResponse, historyResponse] = await Promise.all([
        axios.get(`${API_URL}/api/prices/current`),
        axios.get(`${API_URL}/api/prices/history`)
      ]);

      setCurrentPrice(currentResponse.data);
      setHistoryData(historyResponse.data);
    } catch (err) {
      console.error('Error fetching price data:', err);
      setError('Erreur lors du chargement des donnees. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token) => {
    setAdminToken(token);
  };

  const handleLogout = () => {
    setAdminToken(null);
  };

  const HomePage = () => (
    <DashboardLayout>
      {error ? (
        <div className="card-terminal p-8 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchPriceData} className="btn-gold">
            Reessayer
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart at the top */}
          <EnhancedPriceChart historyData={historyData} loading={loading} />

          {/* Price Hero + Currency Converter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceHero currentPrice={currentPrice} loading={loading} />
            </div>
            <div>
              <CurrencyConverter basePrice24K={currentPrice?.price_per_gram_mad} />
            </div>
          </div>

          {/* Karat Price Grid */}
          <KaratPriceGrid currentPrice={currentPrice} loading={loading} />

          {/* Statistics */}
          <PriceStatistics historyData={historyData} loading={loading} />

          {/* Refresh button */}
          <div className="flex justify-center">
            <button
              onClick={fetchPriceData}
              disabled={loading}
              className="btn-ghost flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser les donnees
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/login"
            element={<AdminLogin onLogin={handleLogin} />}
          />
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard token={adminToken} onLogout={handleLogout} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
