/**
 * Format currency value
 */
export const formatCurrency = (value, currency = '₹') => {
  if (value === null || value === undefined) return '-';
  return `${currency}${value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format date to display format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone) => {
  if (!phone) return '-';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as +91 XXXXX XXXXX for Indian numbers
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Debounce function for search
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format large numbers with abbreviations
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

/**
 * Get SR count text
 */
export const getSRText = (count) => {
  return count === 1 ? '1 SR' : `${count} SRs`;
};

export default {
  formatCurrency,
  formatDate,
  formatPhone,
  copyToClipboard,
  debounce,
  formatNumber,
  getSRText,
};
