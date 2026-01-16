import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, {
        password: password
      });

      if (response.data.access_token) {
        localStorage.setItem('admin_token', response.data.access_token);
        onLogin(response.data.access_token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-terminal p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gold-400 mb-2">LUXORIA</h1>
            <h2 className="text-terminal-text text-lg">Connexion Administrateur</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="label-terminal">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                disabled={loading}
                placeholder="Entrez votre mot de passe"
                className="input-terminal"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-terminal-muted hover:text-gold-400 text-sm transition-colors">
              ← Retour a l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
