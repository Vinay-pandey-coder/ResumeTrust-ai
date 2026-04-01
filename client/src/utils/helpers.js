/**
 * Formats a date string to "DD MMM YYYY" format
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

/**
 * Returns a CSS variable string based on the score
 * @param {number} score 
 * @returns {string}
 */
export const getScoreColor = (score) => {
  if (score >= 80) return 'var(--success)';
  if (score >= 50) return 'var(--warning)';
  return 'var(--danger)';
};

/**
 * Returns a text label based on the score
 * @param {number} score 
 * @returns {string}
 */
export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 50) return 'Average';
  return 'Needs Work';
};

/**
 * Returns a CSS badge class based on the score
 * @param {number} score 
 * @returns {string}
 */
export const getScoreBadgeClass = (score) => {
  if (score >= 80) return 'badge-success';
  if (score >= 50) return 'badge-warning';
  return 'badge-danger';
};

/**
 * Simple LocalStorage wrappers
 */
export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return data; // Return raw string if not JSON
  }
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};

/**
 * Truncates text with ellipsis
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export const truncate = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
