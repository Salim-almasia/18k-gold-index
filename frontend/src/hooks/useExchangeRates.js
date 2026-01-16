import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'luxoria_exchange_rates';
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// Fallback rates (approximate)
const FALLBACK_RATES = {
  MAD: 1,
  EUR: 0.092,
  USD: 0.099,
};

export const CURRENCIES = [
  { code: 'MAD', name: 'Dirham Marocain', symbol: 'DH', flag: '🇲🇦' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'USD', name: 'Dollar US', symbol: '$', flag: '🇺🇸' },
];

export const useExchangeRates = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates: cachedRates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setRates(cachedRates);
          setLastUpdated(new Date(timestamp));
          setLoading(false);
          return;
        }
      }

      // Fetch fresh rates
      const response = await fetch('https://api.exchangerate.host/latest?base=MAD&symbols=EUR,USD');
      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const newRates = {
        MAD: 1,
        EUR: data.rates?.EUR || FALLBACK_RATES.EUR,
        USD: data.rates?.USD || FALLBACK_RATES.USD,
      };

      // Cache the rates
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        rates: newRates,
        timestamp: Date.now(),
      }));

      setRates(newRates);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch exchange rates, using fallback:', err);
      setRates(FALLBACK_RATES);
      setError('Taux estimés');
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convert = useCallback((amount, fromCurrency, toCurrency) => {
    if (!rates || !amount) return null;

    const amountInMAD = fromCurrency === 'MAD'
      ? amount
      : amount / rates[fromCurrency];

    return toCurrency === 'MAD'
      ? amountInMAD
      : amountInMAD * rates[toCurrency];
  }, [rates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    convert,
    refresh: fetchRates,
  };
};
