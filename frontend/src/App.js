import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from './config';

// Context
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Admin components
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Pages
import HomePage from './components/pages/HomePage';
import PricePage from './components/pages/PricePage';
import Blog from './components/pages/Blog';
import ArticlePage from './components/pages/ArticlePage';
import Contact from './components/pages/Contact';
import CGU from './components/pages/CGU';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import CookiesPolicy from './components/pages/CookiesPolicy';
import Disclaimer from './components/pages/Disclaimer';
import FAQ from './components/pages/FAQ';
import NotFound from './components/pages/NotFound';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

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

  // Helper to render PricePage with all required props
  const renderPricePage = (showWhySection = false) => (
    <PricePage
      currentPrice={currentPrice}
      historyData={historyData}
      loading={loading}
      error={error}
      timeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      onRefresh={fetchPriceData}
      showWhySection={showWhySection}
    />
  );

  // Define all routes (will be duplicated for /ar prefix)
  const AppRoutes = () => (
    <Routes>
      {/* French Routes (default) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/prix-de-lor" element={renderPricePage(true)} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/page/:page" element={<Blog />} />
      <Route path="/blog/:category" element={<Blog />} />
      <Route path="/blog/:category/page/:page" element={<Blog />} />
      <Route path="/article/:slug" element={<ArticlePage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/conditions-generales-utilisation" element={<CGU />} />
      <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
      <Route path="/politique-de-cookies" element={<CookiesPolicy />} />
      <Route path="/clause-non-responsabilite" element={<Disclaimer />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Arabic Routes (/ar prefix) */}
      <Route path="/ar" element={<HomePage />} />
      <Route path="/ar/prix-de-lor" element={renderPricePage(true)} />
      <Route path="/ar/blog" element={<Blog />} />
      <Route path="/ar/blog/page/:page" element={<Blog />} />
      <Route path="/ar/blog/:category" element={<Blog />} />
      <Route path="/ar/blog/:category/page/:page" element={<Blog />} />
      <Route path="/ar/article/:slug" element={<ArticlePage />} />
      <Route path="/ar/contact" element={<Contact />} />
      <Route path="/ar/conditions-generales-utilisation" element={<CGU />} />
      <Route path="/ar/politique-de-confidentialite" element={<PrivacyPolicy />} />
      <Route path="/ar/politique-de-cookies" element={<CookiesPolicy />} />
      <Route path="/ar/clause-non-responsabilite" element={<Disclaimer />} />
      <Route path="/ar/faq" element={<FAQ />} />

      {/* Admin Routes (no language prefix) */}
      <Route
        path="/admin/login"
        element={<AdminLogin onLogin={handleLogin} />}
      />
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard token={adminToken} onLogout={handleLogout} />}
      />

      {/* 404 - Page not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <ThemeProvider>
      <Router>
        <LanguageProvider>
          <ScrollToTop />
          <AppRoutes />
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
