import { apiCall, isMockMode } from './apiConfig';
import { approvalHistory as mockHistory, requests as mockRequests, users as mockUsers } from '../data/mockData';
import { persist } from '../data/mockPersistence';

const addHistoryRecord = (requestId, approverRole, action, comments) => {
  const role = (approverRole || 'manager').replace('-', '_');
  const approver = mockUsers.find(u => u.role === role);
  const record = {
    id: `AH${String(mockHistory.length + 1).padStart(3, '0')}`,
    requestId,
    approverName: approver?.name || 'System Approver',
    approverRole: role,
    action,
    comments: comments || '',
    timestamp: new Date().toISOString(),
  };
  mockHistory.push(record);
  persist('approvalHistory', mockHistory);
  return record;
};

// ============================================
// Approval Service
// ============================================

/**
 * GET /approvals/pending?role=string
 * Headers: { Authorization: "Bearer <token>" }
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",
 *       "title": "string",
 *       "description": "string",
 *       "category": "string",
 *       "estimatedCost": "number",
 *       "department": "string",
 *       "createdBy": "string",
 *       "createdByName": "string",
 *       "status": "string",
 *       "createdAt": "string",
 *       "priority": "string"
 *     }
 *   ],
 *   "totalElements": "number"
 * }
 */
export const getPendingApprovals = async (role) => {
  // ── Real API call ──
  // return apiCall(`/approvals/pending?role=${role}`);

  // ── Mock ──
  if (isMockMode()) {
    const statusMap = {
      manager: 'pending_manager',
      senior_manager: 'pending_senior_manager',
      head: 'pending_head',
    };
    const pendingStatus = statusMap[role];
    const content = mockRequests.filter(r => r.status === pendingStatus);
    return { content, totalElements: content.length };
  }
};

/**
 * POST /approvals/:requestId/approve
 * 
 * Request Body:
 * {
 *   "comments": "string",     // optional approval comments
 *   "approverRole": "string"  // role of the approver
 * }
 * 
 * Response (200):
 * {
 *   "message": "Request approved",
 *   "newStatus": "string",     // next status in the chain
 *   "approvalRecord": {
 *     "id": "string",
 *     "requestId": "string",
 *     "approverName": "string",
 *     "approverRole": "string",
 *     "action": "approved",
 *     "comments": "string",
 *     "timestamp": "string"
 *   }
 * }
 */
export const approveRequest = async (requestId, comments, approverRole) => {
  // ── Real API call ──
  // return apiCall(`/approvals/${requestId}/approve`, {
  //   method: 'POST',
  //   body: JSON.stringify({ comments, approverRole }),
  // });

  // ── Mock ──
  if (isMockMode()) {
    const request = mockRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Request not found');
    
    const nextStatus = {
      pending_manager: request.estimatedCost > 50000 ? 'pending_senior_manager' : 'approved',
      pending_senior_manager: request.estimatedCost > 200000 ? 'pending_head' : 'approved',
      pending_head: 'approved',
    };
    request.status = nextStatus[request.status] || 'approved';
    request.updatedAt = new Date().toISOString();
    const record = addHistoryRecord(requestId, approverRole, 'approved', comments);
    persist('requests', mockRequests);
    return { message: 'Request approved', newStatus: request.status, approvalRecord: record };
  }
};

/**
 * POST /approvals/:requestId/reject
 * 
 * Request Body:
 * {
 *   "comments": "string",     // required rejection reason
 *   "approverRole": "string"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Request rejected",
 *   "newStatus": "rejected"
 * }
 */
export const rejectRequest = async (requestId, comments, approverRole) => {
  // ── Real API call ──
  // return apiCall(`/approvals/${requestId}/reject`, {
  //   method: 'POST',
  //   body: JSON.stringify({ comments, approverRole }),
  // });

  // ── Mock ──
  if (isMockMode()) {
    const request = mockRequests.find(r => r.id === requestId);
    let record = null;
    if (request) {
      request.status = 'rejected';
      request.updatedAt = new Date().toISOString();
      record = addHistoryRecord(requestId, approverRole, 'rejected', comments);
      persist('requests', mockRequests);
    }
    return { message: 'Request rejected', newStatus: 'rejected', approvalRecord: record };
  }
};

/**
 * POST /approvals/:requestId/return
 * 
 * Request Body:
 * {
 *   "comments": "string",     // required correction notes
 *   "approverRole": "string"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Request returned for correction",
 *   "newStatus": "draft"
 * }
 */
export const returnRequest = async (requestId, comments, approverRole) => {
  // ── Real API call ──
  // return apiCall(`/approvals/${requestId}/return`, {
  //   method: 'POST',
  //   body: JSON.stringify({ comments, approverRole }),
  // });

  // ── Mock ──
  if (isMockMode()) {
    const request = mockRequests.find(r => r.id === requestId);
    let record = null;
    if (request) {
      request.status = 'draft';
      request.updatedAt = new Date().toISOString();
      record = addHistoryRecord(requestId, approverRole, 'returned', comments);
      persist('requests', mockRequests);
    }
    return { message: 'Request returned for correction', newStatus: 'draft', approvalRecord: record };
  }
};
