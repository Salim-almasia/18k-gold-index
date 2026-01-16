import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import { formatPrice, formatDate } from '../utils/formatters';

const AdminDashboard = ({ token, onLogout }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentPrices, setRecentPrices] = useState([]);
  const navigate = useNavigate();

  const fetchRecentPrices = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/prices/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setRecentPrices(data.slice(0, 10));
    } catch (err) {
      console.error('Error fetching prices:', err);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchRecentPrices();
    }
  }, [token, navigate, fetchRecentPrices]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/api/admin/prices`,
        { date: date, price_per_gram_mad: parseFloat(price) },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setMessage('Prix ajoute avec succes!');
      setPrice('');
      fetchRecentPrices();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Session expiree. Veuillez vous reconnecter.');
        setTimeout(() => handleLogout(), 2000);
      } else {
        setError('Erreur lors de l\'ajout du prix');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    onLogout();
    navigate('/admin/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <header className="border-b border-terminal-border bg-terminal-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gold-400">Administration</h1>
            <button onClick={handleLogout} className="btn-ghost text-sm">
              Deconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Price Form */}
          <div className="card-terminal p-6">
            <h2 className="text-terminal-text text-lg font-semibold mb-6">
              Ajouter un nouveau prix
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="label-terminal">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  disabled={loading}
                  className="input-terminal"
                />
              </div>

              <div>
                <label htmlFor="price" className="label-terminal">Prix par gramme (MAD)</label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: 1250.50"
                  className="input-terminal"
                />
              </div>

              {message && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-gold w-full">
                {loading ? 'Enregistrement...' : 'Ajouter le prix'}
              </button>
            </form>
          </div>

          {/* Recent Prices Table */}
          <div className="card-terminal p-6">
            <h2 className="text-terminal-text text-lg font-semibold mb-6">
              Prix recents
            </h2>

            {recentPrices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-terminal-border">
                      <th className="text-left text-terminal-muted text-sm font-medium py-3 px-2">
                        Date
                      </th>
                      <th className="text-right text-terminal-muted text-sm font-medium py-3 px-2">
                        Prix (MAD/g)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPrices.map((item) => (
                      <tr key={item.id} className="border-b border-terminal-border/50 hover:bg-terminal-border/20">
                        <td className="py-3 px-2 text-terminal-text text-sm">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-gold-400">
                          {formatPrice(item.price_per_gram_mad)} MAD
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-terminal-muted text-center py-8">
                Aucun prix enregistre
              </p>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-terminal-muted hover:text-gold-400 text-sm transition-colors">
            ← Retour a l'accueil
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
