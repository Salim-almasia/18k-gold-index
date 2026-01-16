/**
 * Gold karat purity percentages
 * 24K = 99.9% pure gold (base reference)
 * 21K = 87.5% pure gold (21/24)
 * 18K = 75.0% pure gold (18/24)
 */
export const KARAT_CONFIG = {
  24: { purity: 1.000, label: '24 Carats', shortLabel: '24K', description: 'Or pur (999)' },
  21: { purity: 0.875, label: '21 Carats', shortLabel: '21K', description: 'Or 875' },
  18: { purity: 0.750, label: '18 Carats', shortLabel: '18K', description: 'Or 750' },
};

/**
 * Calculate price for a specific karat based on 24K price
 */
export const calculateKaratPrice = (price24K, karat) => {
  const config = KARAT_CONFIG[karat];
  if (!config) return null;
  return price24K * config.purity;
};

/**
 * Calculate all karat prices from base 24K price
 */
export const calculateAllKaratPrices = (price24K) => {
  if (!price24K || price24K <= 0) return null;

  return Object.entries(KARAT_CONFIG).reduce((acc, [karat, config]) => {
    acc[karat] = {
      ...config,
      price: price24K * config.purity,
    };
    return acc;
  }, {});
};
