import { apiCall, isMockMode } from './apiConfig';
import { purchaseOrders as mockPOs } from '../data/mockData';
import {
  processPurchaseOrder as storeProcessPo,
  getPurchaseOrdersForUser,
  availablePoActions,
} from '../store/epsStore';

// ============================================
// Purchase Order Service
// ============================================

/**
 * GET /purchase-orders
 * Query: ?status=string&supplierId=string&page=number&size=number
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",            // e.g. "PO-2024-001"
 *       "requestId": "string",
 *       "supplierId": "string",
 *       "supplierName": "string",
 *       "items": [
 *         {
 *           "name": "string",
 *           "quantity": "number",
 *           "unitPrice": "number",
 *           "total": "number"
 *         }
 *       ],
 *       "subtotal": "number",
 *       "tax": "number",
 *       "totalAmount": "number",
 *       "deliveryDate": "string",
 *       "status": "string",        // "draft"|"sent"|"accepted"|"delivered"|"closed"
 *       "createdAt": "string",
 *       "createdBy": "string"
 *     }
 *   ],
 *   "totalElements": "number"
 * }
 */
export const getPurchaseOrders = async (filters = {}) => {
  // return apiCall(`/purchase-orders?${new URLSearchParams(filters)}`);
  if (isMockMode()) {
    let filtered = [...mockPOs];
    if (filters.status) filtered = filtered.filter(po => po.status === filters.status);
    return { content: filtered, totalElements: filtered.length };
  }
};

/**
 * GET /purchase-orders/:id
 */
export const getPurchaseOrderById = async (id) => {
  // return apiCall(`/purchase-orders/${id}`);
  if (isMockMode()) {
    return mockPOs.find(po => po.id === id);
  }
};

/**
 * POST /purchase-orders
 * 
 * Request Body:
 * {
 *   "requestId": "string",
 *   "supplierId": "string",
 *   "items": [{ "name": "string", "quantity": "number", "unitPrice": "number" }],
 *   "deliveryDate": "string",
 *   "taxRate": "number"           // e.g. 18 for 18% GST
 * }
 * 
 * Response (201): Created PO with calculated totals
 */
export const createPurchaseOrder = async (data) => {
  // return apiCall('/purchase-orders', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const items = data.items.map(i => ({ ...i, total: i.quantity * i.unitPrice }));
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const tax = subtotal * ((data.taxRate || 18) / 100);
    const po = {
      ...data, items, subtotal, tax, totalAmount: subtotal + tax,
      id: `PO-2024-${String(mockPOs.length + 1).padStart(3, '0')}`,
      status: 'draft', createdAt: new Date().toISOString().split('T')[0],
    };
    mockPOs.push(po);
    return po;
  }
};

/**
 * PATCH /purchase-orders/:id/status
 * Request Body: { "status": "string" }
 */
export const updatePOStatus = async (id, status) => {
  // return apiCall(`/purchase-orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
  if (isMockMode()) {
    const po = mockPOs.find(p => p.id === id);
    if (po) po.status = status;
    return { message: 'Status updated', newStatus: status };
  }
};

/**
 * PATCH /purchase-orders/:id/process
 * Request Body: { "status": "string", "remarks": "string" }
 * Progresses the PO through its lifecycle; only central procurement or the
 * department team designated for the PO's category may call it.
 */
export const processPurchaseOrder = async (id, status, user, remarks = '') => {
  // return apiCall(`/purchase-orders/${id}/process`, { method: 'PATCH', body: JSON.stringify({ status, remarks }) });
  if (isMockMode()) {
    return storeProcessPo(id, status, user, remarks);
  }
};

/** Purchase orders the signed-in user's team is allowed to work on. */
export const getMyPurchaseOrders = async (user, filters = {}) => {
  if (isMockMode()) {
    const content = getPurchaseOrdersForUser(user, filters);
    return { content, totalElements: content.length };
  }
};

export const getPoActions = (po, user) => availablePoActions(po, user);
