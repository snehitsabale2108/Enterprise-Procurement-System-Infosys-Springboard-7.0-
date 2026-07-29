import { isMockMode } from './apiConfig';
import { departments as mockDepts, categories as mockCats } from '../data/mockData';

// ============================================
// Department Service
// ============================================

/**
 * GET /departments
 * Response (200): { "content": [{ "id", "name", "head", "budget", "budgetUsed", "employeeCount", "status" }] }
 */
export const getDepartments = async () => {
  // return apiCall('/departments');
  if (isMockMode()) return { content: [...mockDepts] };
};

/** POST /departments — Body: { name, head, budget } */
export const createDepartment = async (data) => {
  // return apiCall('/departments', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const dept = { ...data, id: `D${String(mockDepts.length + 1).padStart(3, '0')}`, budgetUsed: 0, employeeCount: 0, status: 'active' };
    mockDepts.push(dept);
    return dept;
  }
};

/** PUT /departments/:id */
export const updateDepartment = async (id, data) => {
  // return apiCall(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  if (isMockMode()) {
    const idx = mockDepts.findIndex(d => d.id === id);
    if (idx > -1) mockDepts[idx] = { ...mockDepts[idx], ...data };
    return mockDepts[idx];
  }
};

// ============================================
// Category Service
// ============================================

/**
 * GET /categories
 * Response (200): { "content": [{ "id", "name", "subcategories": [...], "routeTo", "icon" }] }
 */
export const getCategories = async () => {
  // return apiCall('/categories');
  if (isMockMode()) return { content: [...mockCats] };
};

/** POST /categories — Body: { name, subcategories: [], routeTo, icon } */
export const createCategory = async (data) => {
  // return apiCall('/categories', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const cat = { ...data, id: `C${String(mockCats.length + 1).padStart(3, '0')}` };
    mockCats.push(cat);
    return cat;
  }
};

/** PUT /categories/:id */
export const updateCategory = async (id, data) => {
  // return apiCall(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  if (isMockMode()) {
    const idx = mockCats.findIndex(c => c.id === id);
    if (idx > -1) mockCats[idx] = { ...mockCats[idx], ...data };
    return mockCats[idx];
  }
};
