export const formatCurrency = (amount: string | number): string => {
  // If it's already a formatted string (contains non-digit characters other than standard formatters)
  // or if it's "Gratis", return as is.
  if (typeof amount === 'string') {
    if (amount.toLowerCase().includes('gratis') || amount.includes('Rp') || amount.includes('-')) {
      return amount;
    }
    // Try to parse if it's just a number string like "50000"
    const parsed = parseFloat(amount.replace(/[^\d.-]/g, ''));
    if (isNaN(parsed)) return amount; // Fallback to original string
    amount = parsed;
  }

  const numAmount = amount;
  if (isNaN(numAmount)) return 'N/A';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Alam: '#22c55e',
    Budaya: '#f59e0b',
    Kuliner: '#ef4444',
    Sejarah: '#8b5cf6',
    default: '#6b7280',
  };
  return colors[category] || colors.default;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Alam: 'leaf',
    Budaya: 'school',
    Kuliner: 'restaurant',
    Sejarah: 'time',
    default: 'location',
  };
  return icons[category] || icons.default;
};

export default {
  formatCurrency,
  formatRating,
  formatDistance,
  capitalizeFirst,
  truncateText,
  getCategoryColor,
  getCategoryIcon,
};
