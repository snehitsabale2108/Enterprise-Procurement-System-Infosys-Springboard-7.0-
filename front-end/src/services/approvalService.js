import { apiCall, isMockMode } from './apiConfig';
import { approvalHistory as mockHistory, requests as mockRequests, users as mockUsers } from '../data/mockData';
import {
  approveRequest as storeApprove,
  rejectRequest as storeReject,
  returnRequest as storeReturn,
} from '../store/epsStore';

/** Resolves the acting approver: an explicit user, or the first active holder of the role. */
const resolveActor = (actor, role) =>
  (typeof actor === 'object' && actor)
    || mockUsers.find(u => u.role === role && u.status === 'active')
    || { name: 'Approver', role };

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
export const approveRequest = async (requestId, comments, approverRole, actor) => {
  if (!isMockMode()) {
    return apiCall(`/approvals/${requestId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments, approverRole }),
    });
  }

  const request = storeApprove(requestId, resolveActor(actor, approverRole), comments);
  return { message: 'Request approved', newStatus: request.status };
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
export const rejectRequest = async (requestId, comments, approverRole, actor) => {
  if (!isMockMode()) {
    return apiCall(`/approvals/${requestId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ comments, approverRole }),
    });
  }

  storeReject(requestId, resolveActor(actor, approverRole), comments);
  return { message: 'Request rejected', newStatus: 'rejected' };
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
 *   "newStatus": "returned"   // editable again by the requester
 * }
 */
export const returnRequest = async (requestId, comments, approverRole, actor) => {
  if (!isMockMode()) {
    return apiCall(`/approvals/${requestId}/return`, {
      method: 'POST',
      body: JSON.stringify({ comments, approverRole }),
    });
  }

  // Returned requests become editable drafts again for the requester.
  storeReturn(requestId, resolveActor(actor, approverRole), comments);
  return { message: 'Request returned for correction', newStatus: 'returned' };
};
