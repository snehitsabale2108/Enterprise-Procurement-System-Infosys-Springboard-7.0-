import { isMockMode } from './apiConfig';
import { goodsReceiptNotes as mockGRNs } from '../data/mockData';

// ============================================
// GRN (Goods Receipt Note) Service
// ============================================

/**
 * GET /grn
 * Query: ?poNumber=string&status=string
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",            // e.g. "GRN-2024-001"
 *       "poNumber": "string",
 *       "items": [
 *         {
 *           "name": "string",
 *           "orderedQty": "number",
 *           "receivedQty": "number",
 *           "qualityCheck": "string"  // "passed"|"failed"|"partial"
 *         }
 *       ],
 *       "receivedDate": "string",
 *       "verifiedBy": "string",      // user ID
 *       "handoverTo": "string",      // user ID
 *       "handoverConfirmed": "boolean",
 *       "remarks": "string",
 *       "status": "string"           // "pending"|"verified"|"completed"
 *     }
 *   ]
 * }
 */
export const getGRNs = async (filters = {}) => {
  // return apiCall(`/grn?${new URLSearchParams(filters)}`);
  if (isMockMode()) {
    let filtered = [...mockGRNs];
    if (filters.poNumber) filtered = filtered.filter(g => g.poNumber === filters.poNumber);
    return { content: filtered };
  }
};

/**
 * POST /grn
 * 
 * Request Body:
 * {
 *   "poNumber": "string",
 *   "items": [{ "name": "string", "orderedQty": n, "receivedQty": n, "qualityCheck": "passed"|"failed" }],
 *   "remarks": "string",
 *   "handoverTo": "string"
 * }
 */
export const createGRN = async (data) => {
  // return apiCall('/grn', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const grn = { ...data, id: `GRN-2024-${String(mockGRNs.length + 1).padStart(3, '0')}`, receivedDate: new Date().toISOString().split('T')[0], status: 'pending', handoverConfirmed: false };
    mockGRNs.push(grn);
    return grn;
  }
};
