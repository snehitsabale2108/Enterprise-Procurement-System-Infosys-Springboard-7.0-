import { apiCall, isMockMode } from './apiConfig';
import { users } from '../data/mockData';

// ============================================
// Auth Service
// ============================================

/**
 * POST /auth/login
 * 
 * Request Body:
 * {
 *   "username": "string",    // email or username
 *   "password": "string"
 * }
 * 
 * Response (200):
 * {
 *   "token": "string",       // JWT token
 *   "refreshToken": "string",
 *   "user": {
 *     "id": "string",
 *     "name": "string",
 *     "email": "string",
 *     "role": "string",      // e.g. "employee", "manager", "admin"
 *     "department": "string",
 *     "avatar": "string",
 *     "phone": "string",
 *     "status": "string"
 *   },
 *   "expiresIn": 86400       // seconds
 * }
 * 
 * Error (401):
 * { "message": "Invalid credentials" }
 */
export const login = async (userId) => {
  // ── Real API call (uncomment when backend is ready) ──
  // return apiCall('/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ username, password }),
  // });

  // ── Mock Implementation ──
  if (isMockMode()) {
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    localStorage.setItem('eps_token', token);
    localStorage.setItem('eps_user', JSON.stringify(user));
    return { token, user, expiresIn: 86400 };
  }
};

/**
 * POST /auth/logout
 * Headers: { Authorization: "Bearer <token>" }
 * Response (200): { "message": "Logged out successfully" }
 */
export const logout = async () => {
  // ── Real API call ──
  // return apiCall('/auth/logout', { method: 'POST' });

  // ── Mock ──
  localStorage.removeItem('eps_token');
  localStorage.removeItem('eps_user');
  return { message: 'Logged out' };
};

/**
 * GET /auth/profile
 * Headers: { Authorization: "Bearer <token>" }
 * 
 * Response (200):
 * {
 *   "id": "string",
 *   "name": "string",
 *   "email": "string",
 *   "role": "string",
 *   "department": "string",
 *   "avatar": "string",
 *   "phone": "string",
 *   "status": "string",
 *   "createdAt": "string"
 * }
 */
export const getProfile = async () => {
  // ── Real API call ──
  // return apiCall('/auth/profile');

  // ── Mock ──
  if (isMockMode()) {
    const user = JSON.parse(localStorage.getItem('eps_user'));
    if (!user) throw new Error('Not authenticated');
    return user;
  }
};

/**
 * POST /auth/reset-password
 * 
 * Request Body:
 * {
 *   "email": "string",
 *   "oldPassword": "string",
 *   "newPassword": "string"
 * }
 * 
 * Response (200): { "message": "Password reset successfully" }
 */
export const resetPassword = async (email, oldPassword, newPassword) => {
  // ── Real API call ──
  // return apiCall('/auth/reset-password', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, oldPassword, newPassword }),
  // });

  // ── Mock ──
  if (isMockMode()) {
    return { message: 'Password reset successfully' };
  }
};
