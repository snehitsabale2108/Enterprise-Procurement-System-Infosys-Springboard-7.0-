import { isMockMode } from './apiConfig';
import { users as mockUsers } from '../data/mockData';

// ============================================
// User Service
// ============================================

/**
 * GET /users
 * Query: ?role=string&department=string&status=string&page=number&size=number
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",
 *       "name": "string",
 *       "email": "string",
 *       "role": "string",
 *       "department": "string",
 *       "avatar": "string",
 *       "phone": "string",
 *       "status": "string",        // "active"|"inactive"|"suspended"
 *       "createdAt": "string"
 *     }
 *   ],
 *   "totalElements": "number"
 * }
 */
export const getUsers = async (filters = {}) => {
  // return apiCall(`/users?${new URLSearchParams(filters)}`);
  if (isMockMode()) {
    let filtered = [...mockUsers];
    if (filters.role) filtered = filtered.filter(u => u.role === filters.role);
    if (filters.department) filtered = filtered.filter(u => u.department === filters.department);
    return { content: filtered, totalElements: filtered.length };
  }
};

/**
 * POST /users
 * Request Body: { name, email, role, department, phone, password }
 * Response (201): Created user
 */
export const createUser = async (data) => {
  // return apiCall('/users', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const user = { ...data, id: `U${String(mockUsers.length + 1).padStart(3, '0')}`, status: 'active', avatar: '#6366f1', createdAt: new Date().toISOString().split('T')[0] };
    mockUsers.push(user);
    return user;
  }
};

/**
 * PUT /users/:id
 */
export const updateUser = async (id, data) => {
  // return apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  if (isMockMode()) {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx > -1) mockUsers[idx] = { ...mockUsers[idx], ...data };
    return mockUsers[idx];
  }
};

/**
 * DELETE /users/:id
 * Response (200): { "message": "User deleted" }
 */
export const deleteUser = async (id) => {
  // return apiCall(`/users/${id}`, { method: 'DELETE' });
  if (isMockMode()) {
    const idx = mockUsers.findIndex(u => u.id === id);
    if (idx > -1) mockUsers[idx].status = 'inactive';
    return { message: 'User deleted' };
  }
};
