// ============================================
// API Configuration
// ============================================
// STEP 1: Set your Spring Boot backend URL below
// STEP 2: Uncomment the real API calls in each service file
// ============================================

// export const API_BASE_URL = 'http://localhost:8080/api';
export const API_BASE_URL = ''; // empty = mock mode

/**
 * Helper: makes an authenticated API call
 * @param {string} endpoint - API endpoint path (e.g., '/auth/login')
 * @param {object} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} parsed JSON response
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('eps_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Check if we're in mock mode
 */
export const isMockMode = () => !API_BASE_URL;
