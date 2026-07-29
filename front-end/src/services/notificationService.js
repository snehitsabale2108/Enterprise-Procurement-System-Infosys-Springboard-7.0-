import { isMockMode } from './apiConfig';
import { notifications as mockNotifications } from '../data/mockData';

// ============================================
// Notification Service
// ============================================

/**
 * GET /notifications?userId=string
 * 
 * Response (200):
 * [
 *   {
 *     "id": "string",
 *     "userId": "string",
 *     "type": "string",       // "request_approved"|"request_rejected"|"pending_approval"|"po_created"|"delivery_completed"|"invoice_pending"|"payment_completed"
 *     "title": "string",
 *     "message": "string",
 *     "read": "boolean",
 *     "createdAt": "string",
 *     "link": "string"        // frontend route to navigate to
 *   }
 * ]
 */
export const getNotifications = async (userId) => {
  // return apiCall(`/notifications?userId=${userId}`);
  if (isMockMode()) {
    return mockNotifications.filter(n => n.userId === userId);
  }
};

/**
 * PATCH /notifications/:id/read
 * Response (200): { "message": "Notification marked as read" }
 */
export const markAsRead = async (id) => {
  // return apiCall(`/notifications/${id}/read`, { method: 'PATCH' });
  if (isMockMode()) {
    const n = mockNotifications.find(n => n.id === id);
    if (n) n.read = true;
    return { message: 'Marked as read' };
  }
};

/**
 * PATCH /notifications/read-all?userId=string
 * Response (200): { "message": "All notifications marked as read" }
 */
export const markAllAsRead = async (userId) => {
  // return apiCall(`/notifications/read-all?userId=${userId}`, { method: 'PATCH' });
  if (isMockMode()) {
    mockNotifications.filter(n => n.userId === userId).forEach(n => n.read = true);
    return { message: 'All marked as read' };
  }
};
