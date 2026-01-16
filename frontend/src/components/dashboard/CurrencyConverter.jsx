import React, { useState, useMemo } from 'react';
import { useExchangeRates, CURRENCIES } from '../../hooks/useExchangeRates';
import { formatPrice } from '../../utils/formatters';
import { Skeleton } from '../ui/Skeleton';

const CurrencyConverter = ({ basePrice24K }) => {
  const { rates, loading, error, convert } = useExchangeRates();
  const [customAmount, setCustomAmount] = useState('');

  const formatCurrencyPrice = (value, currency) => {
    const currencyConfig = CURRENCIES.find(c => c.code === currency);
    return formatPrice(value) + ' ' + currencyConfig.symbol;
  };

  // Calculate prices in all currencies
  const convertedPrices = useMemo(() => {
    if (!rates || !basePrice24K) return null;

    return CURRENCIES.reduce((acc, { code }) => {
      acc[code] = convert(basePrice24K, 'MAD', code);
      return acc;
    }, {});
  }, [rates, basePrice24K, convert]);

  // Calculate custom amount conversion
  const customConversions = useMemo(() => {
    if (!rates || !customAmount) return null;

    const amount = parseFloat(customAmount);
    if (isNaN(amount)) return null;

    return CURRENCIES.reduce((acc, { code }) => {
      acc[code] = convert(amount, 'MAD', code);
      return acc;
    }, {});
  }, [rates, customAmount, convert]);

  if (loading) {
    return (
      <div className="card-terminal p-4 lg:p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-terminal p-4 lg:p-6">
      <h3 className="text-terminal-muted text-sm font-semibold uppercase tracking-wider mb-4">
        Convertisseur de Devises
      </h3>

      {/* Price per gram in all currencies */}
      <div className="mb-6">
        <p className="text-terminal-muted text-xs mb-2">Prix par gramme (24K)</p>
        <div className="space-y-2">
          {CURRENCIES.map(({ code, flag }) => (
            <div
              key={code}
              className="flex items-center justify-between py-2 px-3 rounded bg-terminal-bg"
            >
              <span className="flex items-center gap-2">
                <span>{flag}</span>
                <span className="text-terminal-muted text-sm">{code}</span>
              </span>
              <span className="font-mono text-white">
                {convertedPrices ? formatCurrencyPrice(convertedPrices[code], code) : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom amount converter */}
      <div className="border-t border-terminal-border pt-4">
        <label className="label-terminal">
          Convertir un montant (MAD)
        </label>
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="Entrez un montant en MAD"
          className="input-terminal"
        />

        {customConversions && (
          <div className="mt-3 space-y-1">
            {CURRENCIES.filter(c => c.code !== 'MAD').map(({ code, flag }) => (
              <div key={code} className="flex justify-between text-sm">
                <span className="text-terminal-muted">{flag} {code}</span>
                <span className="font-mono text-gold-400">
                  {formatCurrencyPrice(customConversions[code], code)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      {error && (
        <div className="mt-4 text-xs text-yellow-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
