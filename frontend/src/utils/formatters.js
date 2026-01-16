/**
 * Format price with French locale
 */
export const formatPrice = (value, decimals = 2) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format variation percentage
 */
export const formatVariation = (value) => {
  if (value === null || value === undefined) return null;
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Format date in French locale
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', { ...defaultOptions, ...options });
};

/**
 * Format short date (DD/MM)
 */
export const formatShortDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
  });
};
