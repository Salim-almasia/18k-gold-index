import { useMemo } from 'react';
import { calculateAllKaratPrices } from '../utils/karatCalculator';

/**
 * Hook to calculate multi-karat prices from base 24K price
 */
export const useKaratCalculations = (basePrice24K, variation24h = null) => {
  return useMemo(() => {
    const karatPrices = calculateAllKaratPrices(basePrice24K);
    if (!karatPrices) return null;

    // Add variation to each karat (same % change applies to all)
    return Object.entries(karatPrices).reduce((acc, [karat, data]) => {
      acc[karat] = {
        ...data,
        variation: variation24h,
      };
      return acc;
    }, {});
  }, [basePrice24K, variation24h]);
};
