import { isMockMode } from './apiConfig';
import { auditLogs as mockLogs } from '../data/mockData';
import { getAuditTrail, getRequestAuditTrail, recordAudit } from '../store/epsStore';

// ============================================
// Audit Service
// ============================================

/**
 * GET /audit-logs
 * Query: ?userId=string&action=string&entity=string&from=string&to=string&page=number&size=number
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",
 *       "userId": "string",
 *       "userName": "string",
 *       "role": "string",
 *       "action": "string",           // "CREATE_REQUEST"|"SUBMIT_REQUEST"|"APPROVE_REQUEST"|"REJECT_REQUEST"|"CREATE_PO"|"PROCESS_PAYMENT"|"UPDATE_USER"|"CREATE_SUPPLIER"
 *       "entity": "string",           // "Request"|"PurchaseOrder"|"Payment"|"User"|"Supplier"
 *       "entityId": "string",
 *       "previousValue": "string|null",
 *       "updatedValue": "string|null",
 *       "ipAddress": "string",
 *       "timestamp": "string",
 *       "remarks": "string"
 *     }
 *   ],
 *   "totalElements": "number",
 *   "totalPages": "number"
 * }
 */
export const getAuditLogs = async (filters = {}) => {
  // const params = new URLSearchParams(filters).toString();
  // return apiCall(`/audit-logs?${params}`);

  if (isMockMode()) {
    let filtered = [...mockLogs];
    if (filters.action) filtered = filtered.filter(l => l.action === filters.action);
    if (filters.entity) filtered = filtered.filter(l => l.entity === filters.entity);
    if (filters.userId) filtered = filtered.filter(l => l.userId === filters.userId);
    return { content: filtered, totalElements: filtered.length, totalPages: 1 };
  }
};

/** GET /audit-logs/entity/:entityId — append-only trail for one entity. */
export const getEntityAuditTrail = async (entityId) => {
  if (isMockMode()) {
    return { content: getAuditTrail(entityId) };
  }
};

/** GET /audit-logs/request/:requestId — request plus its RFQs, quotes and PO. */
export const getRequestTrail = async (requestId) => {
  if (isMockMode()) {
    return { content: getRequestAuditTrail(requestId) };
  }
};

/** POST /audit-logs — record an audit entry (mock mode writes to the store). */
export const createAuditEntry = async (entry) => {
  if (isMockMode()) {
    return recordAudit(entry);
  }
};
