import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import API_URL from './config';

// Context
import { ThemeProvider } from './context/ThemeContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard components
import PriceInfo from './components/dashboard/PriceInfo';
import EnhancedPriceChart from './components/dashboard/EnhancedPriceChart';
import EditorialBlock from './components/dashboard/EditorialBlock';
import WhyFollowGold from './components/dashboard/WhyFollowGold';

// Admin components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Pages
import HomePage from './components/pages/HomePage';
import Blog from './components/pages/Blog';
import ArticlePage from './components/pages/ArticlePage';

const TIMEFRAMES = [
  { key: '1d', label: '1j' },
  { key: '5d', label: '5j' },
  { key: '1m', label: '1m' },
  { key: '3m', label: '3m' },
  { key: '6m', label: '6m' },
  { key: '1y', label: '1a' },
];

function App() {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));
  const [timeframe, setTimeframe] = useState('5d');

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
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
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

  // Immediate timeframe change - no debounce, direct state update
  const handleTimeframeChange = useCallback((newTimeframe) => {
    setTimeframe(newTimeframe);
  }, []);

  const PricePage = ({ showWhySection = false }) => (
    <DashboardLayout>
      {error ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-14 h-14 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-500 text-base mb-4">{error}</p>
            <button
              onClick={fetchPriceData}
              className="px-5 py-2 bg-[#002FA7] text-white text-sm font-semibold rounded-lg hover:bg-[#001f7a] transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Page Title */}
            <div className="text-center py-4 mb-6">
              <h1 className="font-title text-2xl lg:text-3xl font-bold text-[#002FA7]">
                Cours de l'Or 18 Carats au Maroc
              </h1>
              <p className="text-sm text-gray-400 mt-1 tracking-wide">
                Signal réel du marché au quotidien — Casablanca —
              </p>
            </div>

            {/* Mobile: Filter at top */}
            <div className="lg:hidden mb-4">
              <div className="flex justify-center gap-1.5">
                {TIMEFRAMES.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleTimeframeChange(key)}
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

            {/* Main Layout: 1/3 + 2/3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left: Signal Or (1/3) */}
              <div className="lg:col-span-1">
                <PriceInfo
                  currentPrice={currentPrice}
                  historyData={historyData}
                  loading={loading}
                  selectedTimeframe={timeframe}
                />
              </div>

              {/* Right: Chart (2/3) */}
              <div className="lg:col-span-2">
                <EnhancedPriceChart
                  historyData={historyData}
                  loading={loading}
                  timeframe={timeframe}
                  onTimeframeChange={handleTimeframeChange}
                  onRefresh={fetchPriceData}
                />
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D2A24C]"></span>
                <span className="w-2 h-2 rounded-full bg-[#002FA7]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D2A24C]"></span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          </div>

          {/* Editorial Block */}
          <EditorialBlock />

          {/* Why Follow Gold Section - Only on /prix-de-lor */}
          {showWhySection && <WhyFollowGold />}
        </>
      )}
    </DashboardLayout>
  );

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prix-de-lor" element={<PricePage showWhySection={true} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<ArticlePage />} />
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
