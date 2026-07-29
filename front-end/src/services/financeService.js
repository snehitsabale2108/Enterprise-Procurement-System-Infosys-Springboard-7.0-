import { apiCall, isMockMode } from './apiConfig';
import { payments as mockPayments } from '../data/mockData';

// ============================================
// Finance Service
// ============================================

/**
 * GET /payments
 * Query: ?status=string&page=number&size=number
 * 
 * Response (200):
 * {
 *   "content": [
 *     {
 *       "id": "string",              // e.g. "PAY-2024-001"
 *       "poNumber": "string",
 *       "supplierName": "string",
 *       "amount": "number",          // INR
 *       "paymentMethod": "string",   // "NEFT"|"RTGS"|"IMPS"|"Cheque"
 *       "referenceNumber": "string",
 *       "status": "string",          // "pending"|"approved"|"processing"|"paid"|"failed"
 *       "paidDate": "string|null",
 *       "verifiedBy": "string|null",
 *       "transactionId": "string|null"
 *     }
 *   ],
 *   "totalElements": "number"
 * }
 */
export const getPayments = async (filters = {}) => {
  // return apiCall(`/payments?${new URLSearchParams(filters)}`);
  if (isMockMode()) {
    let filtered = [...mockPayments];
    if (filters.status) filtered = filtered.filter(p => p.status === filters.status);
    return { content: filtered, totalElements: filtered.length };
  }
};

/**
 * POST /payments/verify
 * 
 * Request Body:
 * {
 *   "paymentId": "string",
 *   "poVerified": "boolean",
 *   "grnVerified": "boolean",
 *   "invoiceVerified": "boolean",
 *   "taxVerified": "boolean",
 *   "amountVerified": "boolean",
 *   "remarks": "string"
 * }
 * 
 * Response (200): { "message": "Invoice verified", "status": "approved" }
 */
export const verifyInvoice = async (data) => {
  // return apiCall('/payments/verify', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const payment = mockPayments.find(p => p.id === data.paymentId);
    if (payment) payment.status = 'approved';
    return { message: 'Invoice verified', status: 'approved' };
  }
};

/**
 * POST /payments/process
 * 
 * Request Body:
 * {
 *   "paymentId": "string",
 *   "paymentMethod": "string",     // "NEFT"|"RTGS"|"IMPS"|"Cheque"
 *   "referenceNumber": "string",
 *   "remarks": "string"
 * }
 * 
 * Response (200):
 * {
 *   "message": "Payment processed",
 *   "transactionId": "string",
 *   "paidDate": "string",
 *   "status": "paid"
 * }
 */
export const processPayment = async (data) => {
  // return apiCall('/payments/process', { method: 'POST', body: JSON.stringify(data) });
  if (isMockMode()) {
    const payment = mockPayments.find(p => p.id === data.paymentId);
    if (payment) {
      payment.status = 'paid';
      payment.paidDate = new Date().toISOString().split('T')[0];
      payment.transactionId = `TXN-${Date.now()}`;
      payment.paymentMethod = data.paymentMethod;
      payment.referenceNumber = data.referenceNumber;
    }
    return { message: 'Payment processed', transactionId: payment?.transactionId, status: 'paid' };
  }
};
