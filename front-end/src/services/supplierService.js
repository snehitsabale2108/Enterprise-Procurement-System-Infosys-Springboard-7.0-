import { apiCall, isMockMode } from './apiConfig';
import { suppliers as mockSuppliers } from '../data/mockData';

// ============================================
// Supplier Service
// ============================================

/**
 * GET /suppliers
 * Query: ?status=string&search=string&page=number&size=number
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",
 *       "companyName": "string",
 *       "businessType": "string",
 *       "gstNumber": "string",
 *       "panNumber": "string",
 *       "bankName": "string",
 *       "accountNumber": "string",
 *       "ifsc": "string",
 *       "contactPerson": "string",
 *       "phone": "string",
 *       "email": "string",
 *       "address": "string",
 *       "status": "string",       // "draft"|"kyc_pending"|"under_verification"|"approved"|"active"|"suspended"|"blacklisted"|"inactive"
 *       "rating": "number",       // 1-5
 *       "totalOrders": "number",
 *       "createdAt": "string"
 *     }
 *   ],
 *   "totalElements": "number",
 *   "totalPages": "number"
 * }
 */
export const getSuppliers = async (filters = {}) => {
  // ── Real API call ──
  // const params = new URLSearchParams(filters).toString();
  // return apiCall(`/suppliers?${params}`);

  if (isMockMode()) {
    let filtered = [...mockSuppliers];
    if (filters.status) filtered = filtered.filter(s => s.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(s => s.companyName.toLowerCase().includes(q));
    }
    return { content: filtered, totalElements: filtered.length, totalPages: 1 };
  }
};

/**
 * GET /suppliers/:id
 */
export const getSupplierById = async (id) => {
  // return apiCall(`/suppliers/${id}`);
  if (isMockMode()) {
    return mockSuppliers.find(s => s.id === id);
  }
};

/**
 * POST /suppliers
 * 
 * Request Body:
 * {
 *   "companyName": "string",
 *   "businessType": "string",
 *   "gstNumber": "string",
 *   "panNumber": "string",
 *   "bankName": "string",
 *   "accountNumber": "string",
 *   "ifsc": "string",
 *   "contactPerson": "string",
 *   "phone": "string",
 *   "email": "string",
 *   "address": "string"
 * }
 * 
 * Response (201): Created supplier with status "draft"
 */
export const createSupplier = async (data) => {
  // return apiCall('/suppliers', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const newSupplier = { ...data, id: `S${String(mockSuppliers.length + 1).padStart(3, '0')}`, status: 'draft', rating: 0, totalOrders: 0, createdAt: new Date().toISOString().split('T')[0] };
    mockSuppliers.push(newSupplier);
    return newSupplier;
  }
};

/**
 * PUT /suppliers/:id
 * Request Body: Same as POST (full update)
 */
export const updateSupplier = async (id, data) => {
  // return apiCall(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  if (isMockMode()) {
    const idx = mockSuppliers.findIndex(s => s.id === id);
    if (idx > -1) mockSuppliers[idx] = { ...mockSuppliers[idx], ...data };
    return mockSuppliers[idx];
  }
};

/**
 * PATCH /suppliers/:id/status
 * 
 * Request Body:
 * {
 *   "status": "string",    // new status
 *   "reason": "string"     // optional
 * }
 * 
 * Response (200): { "message": "Status updated", "newStatus": "string" }
 */
export const updateSupplierStatus = async (id, status, reason) => {
  // return apiCall(`/suppliers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, reason }) });
  if (isMockMode()) {
    const supplier = mockSuppliers.find(s => s.id === id);
    if (supplier) supplier.status = status;
    return { message: 'Status updated', newStatus: status };
  }
};
