import { apiCall, isMockMode } from './apiConfig';
import {
  getPayments as storeGetPayments,
  getPayment as storeGetPayment,
  getPaymentSummary,
  verifyInvoice as storeVerifyInvoice,
  releasePayment as storeReleasePayment,
  confirmPayment as storeConfirmPayment,
  updatePaymentStatus as storeUpdatePaymentStatus,
} from '../store/epsStore';

// ============================================
// Finance Service
// ============================================
// In mock mode every call is delegated to the client store so the whole
// app (dashboards, notification bell, audit trail) stays in sync. With a
// backend URL configured the same calls hit Spring Boot.

/**
 * GET /payments?status=&search=
 * Response (200): { content: Payment[], totalElements: number }
 */
export const getPayments = async (filters = {}) => {
  if (isMockMode()) {
    const content = storeGetPayments(filters);
    return { content, totalElements: content.length };
  }
  return apiCall(`/payments?${new URLSearchParams(filters)}`);
};

/** GET /payments/{id} */
export const getPayment = async (id) => {
  if (isMockMode()) return storeGetPayment(id);
  return apiCall(`/payments/${id}`);
};

/** GET /payments/summary */
export const getPaymentsSummary = async () => {
  if (isMockMode()) return getPaymentSummary();
  return apiCall('/payments/summary');
};

/**
 * POST /payments/verify — three-way match (PO + GRN + invoice + tax + amount).
 * Body: { paymentId, poVerified, grnVerified, invoiceVerified, taxVerified, amountVerified, remarks, actorId }
 */
export const verifyInvoice = async ({ paymentId, remarks, user, ...checks }) => {
  if (isMockMode()) {
    const payment = storeVerifyInvoice(paymentId, { checks, remarks, user });
    return { message: 'Invoice verified', status: payment.status, payment };
  }
  return apiCall('/payments/verify', {
    method: 'POST',
    body: JSON.stringify({ paymentId, remarks, actorId: user?.id, ...checks }),
  });
};

/**
 * POST /payments/{id}/release — release funds to the supplier bank account.
 * Body: { paymentMethod, referenceNumber, remarks, actorId }
 */
export const releasePayment = async ({ paymentId, paymentMethod, referenceNumber, remarks, user }) => {
  if (isMockMode()) {
    const payment = storeReleasePayment(paymentId, { paymentMethod, referenceNumber, remarks, user });
    return { message: 'Payment released', status: payment.status, payment };
  }
  return apiCall(`/payments/${paymentId}/release`, {
    method: 'POST',
    body: JSON.stringify({ paymentMethod, referenceNumber, remarks, actorId: user?.id }),
  });
};

/**
 * POST /payments/{id}/confirm — confirm bank settlement.
 * Body: { transactionId, remarks, actorId }
 */
export const confirmPayment = async ({ paymentId, transactionId, remarks, user }) => {
  if (isMockMode()) {
    const payment = storeConfirmPayment(paymentId, { transactionId, remarks, user });
    return { message: 'Payment completed', status: payment.status, payment };
  }
  return apiCall(`/payments/${paymentId}/confirm`, {
    method: 'POST',
    body: JSON.stringify({ transactionId, remarks, actorId: user?.id }),
  });
};

/**
 * POST /payments/{id}/status — hold, fail or reopen a payment.
 * Body: { status, remarks, actorId }
 */
export const updatePaymentStatus = async ({ paymentId, status, remarks, user }) => {
  if (isMockMode()) {
    const payment = storeUpdatePaymentStatus(paymentId, status, { remarks, user });
    return { message: `Payment ${status}`, status: payment.status, payment };
  }
  return apiCall(`/payments/${paymentId}/status`, {
    method: 'POST',
    body: JSON.stringify({ status, remarks, actorId: user?.id }),
  });
};

/**
 * Legacy helper kept for compatibility: verify + release + confirm in one call.
 */
export const processPayment = async ({ paymentId, paymentMethod, referenceNumber, remarks, user }) => {
  await releasePayment({ paymentId, paymentMethod, referenceNumber, remarks, user });
  return confirmPayment({ paymentId, remarks, user });
};
