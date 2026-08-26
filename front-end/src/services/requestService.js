import { apiCall, isMockMode } from './apiConfig';
import { requests as mockRequests, approvalHistory as mockHistory } from '../data/mockData';
import {
  createRequest as storeCreate,
  updateRequest as storeUpdate,
  submitRequest as storeSubmit,
  cancelRequest as storeCancel,
} from '../store/epsStore';
import { users as mockUsers } from '../data/mockData';

/** Resolves the acting user for mock-mode workflow calls. */
const resolveUser = (actor, userId) =>
  (typeof actor === 'object' && actor) || mockUsers.find(u => u.id === userId) || { id: userId };

// ============================================
// Request Service
// ============================================

/**
 * GET /requests
 * Query Params: ?status=string&department=string&category=string&createdBy=string&page=number&size=number
 * Headers: { Authorization: "Bearer <token>" }
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",               // e.g. "REQ-2024-001"
 *       "title": "string",
 *       "description": "string",
 *       "reason": "string",
 *       "category": "string",          // "Equipment & Assets" | "Software & Digital Services" | "Facilities"
 *       "subcategory": "string",       // e.g. "Laptop", "Software License"
 *       "quantity": "number",
 *       "estimatedCost": "number",     // in INR
 *       "department": "string",
 *       "requiredDate": "string",      // ISO date
 *       "status": "string",           // "draft"|"pending_manager"|"pending_senior_manager"|"pending_head"|"approved"|"rejected"|"in_procurement"|"delivered"|"closed"
 *       "createdBy": "string",         // user ID
 *       "createdAt": "string",         // ISO datetime
 *       "updatedAt": "string",
 *       "priority": "string"           // "low"|"medium"|"high"
 *     }
 *   ],
 *   "totalElements": "number",
 *   "totalPages": "number",
 *   "currentPage": "number"
 * }
 */
export const getRequests = async (filters = {}) => {
  // ── Real API call ──
  // const params = new URLSearchParams(filters).toString();
  // return apiCall(`/requests?${params}`);

  // ── Mock ──
  if (isMockMode()) {
    let filtered = [...mockRequests];
    if (filters.status) filtered = filtered.filter(r => r.status === filters.status);
    if (filters.department) filtered = filtered.filter(r => r.department === filters.department);
    if (filters.category) filtered = filtered.filter(r => r.category === filters.category);
    if (filters.createdBy) filtered = filtered.filter(r => r.createdBy === filters.createdBy);
    return { content: filtered, totalElements: filtered.length, totalPages: 1, currentPage: 0 };
  }
};

/**
 * GET /requests/:id
 * Response: Single request object (same as above)
 */
export const getRequestById = async (id) => {
  // ── Real API call ──
  // return apiCall(`/requests/${id}`);

  // ── Mock ──
  if (isMockMode()) {
    const request = mockRequests.find(r => r.id === id);
    if (!request) throw new Error('Request not found');
    return request;
  }
};

/**
 * POST /requests
 * 
 * Request Body:
 * {
 *   "title": "string",
 *   "description": "string",
 *   "reason": "string",
 *   "category": "string",
 *   "subcategory": "string",
 *   "quantity": "number",
 *   "estimatedCost": "number",
 *   "department": "string",
 *   "requiredDate": "string",     // ISO date
 *   "priority": "string",         // "low"|"medium"|"high"
 *   "status": "string"            // "draft" or "pending_manager"
 * }
 * 
 * Response (201): Created request object with generated ID
 */
export const createRequest = async (data, actor) => {
  if (!isMockMode()) {
    return apiCall('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  return storeCreate(data, resolveUser(actor, data.createdBy), {
    submit: data.status && data.status !== 'draft',
  });
};

/**
 * PUT /requests/:id
 * Request Body: Same as POST /requests (full update)
 * Response (200): Updated request object
 */
export const updateRequest = async (id, data, actor) => {
  if (!isMockMode()) {
    return apiCall(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Only draft and returned requests are editable — enforced by the store.
  return storeUpdate(id, data, resolveUser(actor, data?.createdBy));
};

/**
 * PATCH /requests/:id/submit
 * Response (200): { "message": "Request submitted", "status": "pending_manager" }
 */
export const submitRequest = async (id, actor) => {
  if (!isMockMode()) {
    return apiCall(`/requests/${id}/submit`, { method: 'PATCH' });
  }

  const request = mockRequests.find(r => r.id === id);
  const updated = storeSubmit(id, resolveUser(actor, request?.createdBy));
  return { message: 'Request submitted', status: updated.status };
};

/**
 * PATCH /requests/:id/cancel
 * Response (200): { "message": "Request cancelled" }
 */
export const cancelRequest = async (id, actor) => {
  if (!isMockMode()) {
    return apiCall(`/requests/${id}/cancel`, { method: 'PATCH' });
  }

  if (isMockMode()) {
    const request = mockRequests.find(r => r.id === id);
    storeCancel(id, resolveUser(actor, request?.createdBy));
    return { message: 'Request cancelled' };
  }
};

/**
 * GET /requests/:id/approval-history
 * 
 * Response (200):
 * [
 *   {
 *     "id": "string",
 *     "requestId": "string",
 *     "approverName": "string",
 *     "approverRole": "string",
 *     "action": "string",          // "approved"|"rejected"|"returned"
 *     "comments": "string",
 *     "timestamp": "string"        // ISO datetime
 *   }
 * ]
 */
export const getApprovalHistory = async (requestId) => {
  // ── Real API call ──
  // return apiCall(`/requests/${requestId}/approval-history`);

  // ── Mock ──
  if (isMockMode()) {
    return mockHistory.filter(h => h.requestId === requestId);
  }
};
