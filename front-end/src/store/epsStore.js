/**
 * ============================================================
 * EPS client store
 * ============================================================
 * Single source of truth for the demo (mock) mode. It wraps the
 * mockData collections, implements the procurement workflow rules
 * and publishes changes so every mounted screen re-renders and the
 * notification bell updates live.
 *
 * When a real backend URL is configured in apiConfig.js the service
 * layer talks to Spring Boot instead; the notification stream then
 * comes from /api/notifications/stream (SSE).
 */
import { useEffect, useState } from 'react';
import {
  requests,
  approvalHistory,
  approvalRules,
  users,
  suppliers,
  rfqs,
  quotations,
  purchaseOrders,
  notifications,
  auditLogs,
} from '../data/mockData';
import {
  validateItemCategory,
  assertCanProcessCategory,
  canProcessCategory,
  teamForCategory,
  canTransitionPo,
  nextPoStatuses,
  PO_ACTION_LABELS,
  PO_STAGE_ORDER,
  TEAM_LABELS,
  canRoleTransitionPo,
  rolesForPoTransition,
  FINANCE_PO_STATUSES,
} from './procurementPolicy';

export {
  validateItemCategory,
  suggestCategory,
  classifyItem,
  canProcessCategory,
  teamForCategory,
  nextPoStatuses,
  canTransitionPo,
  PO_ACTION_LABELS,
  PO_STAGE_ORDER,
  PO_FLOW,
  TEAM_LABELS,
  CATEGORY_TEAMS,
  canRoleTransitionPo,
  PO_TRANSITION_ROLES,
} from './procurementPolicy';

// ── Change bus ───────────────────────────────────────────────
const listeners = new Set();
let version = 0;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const emitChange = () => {
  version += 1;
  listeners.forEach((l) => {
    try {
      l(version);
    } catch (err) {
      console.error('store listener failed', err);
    }
  });
};

/** Re-renders a component whenever any store data changes. */
export const useEpsStore = () => {
  const [, setV] = useState(version);
  useEffect(() => subscribe(setV), []);
  return version;
};

// ── Notifications ────────────────────────────────────────────
const notificationListeners = new Set();

/** Subscribe to live notifications (mock mode). Returns an unsubscribe fn. */
export const subscribeNotifications = (listener) => {
  notificationListeners.add(listener);
  return () => notificationListeners.delete(listener);
};

const nextId = (prefix, list, pad = 3) =>
  `${prefix}${String(list.length + 1).padStart(pad, '0')}`;

export const pushNotification = ({ userId, type, title, message, link }) => {
  if (!userId) return null;
  const notification = {
    id: nextId('N', notifications),
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    link: link || null,
  };
  notifications.unshift(notification);
  notificationListeners.forEach((l) => l(notification));
  emitChange();
  return notification;
};

export const pushToRoles = (roles, payload) =>
  users
    .filter((u) => u.status === 'active' && roles.includes(u.role))
    .map((u) => pushNotification({ ...payload, userId: u.id }));

export const pushToSupplier = (supplierId, payload) =>
  users
    .filter((u) => u.role === 'supplier' && u.supplierId === supplierId)
    .map((u) => pushNotification({ ...payload, userId: u.id }));

export const getUserNotifications = (userId) =>
  notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

export const getUnreadCount = (userId) =>
  notifications.filter((n) => n.userId === userId && !n.read).length;

export const markNotificationRead = (id) => {
  const n = notifications.find((x) => x.id === id);
  if (n && !n.read) {
    n.read = true;
    emitChange();
  }
  return n;
};

export const markAllNotificationsRead = (userId) => {
  notifications.filter((n) => n.userId === userId).forEach((n) => { n.read = true; });
  emitChange();
};

// ── Audit trail ──────────────────────────────────────────────
/**
 * Every state change in the system is recorded here. The trail is
 * append-only: entries are never edited or removed, so any screen can
 * replay exactly who did what, when, and what the value was before.
 */
export const recordAudit = ({
  user,
  action,
  entity,
  entityId,
  previousValue = null,
  updatedValue = null,
  remarks = '',
}) => {
  const entry = {
    id: `AL${String(auditLogs.length + 1).padStart(3, '0')}`,
    userId: user?.id || 'SYSTEM',
    userName: user?.name || 'System',
    role: user?.role || 'system',
    action,
    entity,
    entityId,
    previousValue: previousValue === null || previousValue === undefined ? null : String(previousValue),
    updatedValue: updatedValue === null || updatedValue === undefined ? null : String(updatedValue),
    ipAddress: '127.0.0.1',
    timestamp: new Date().toISOString(),
    remarks: remarks || '',
  };
  auditLogs.push(entry);
  return entry;
};

/** Full trail for one entity (request, PO, quotation…), newest first. */
export const getAuditTrail = (entityId) =>
  auditLogs
    .filter((a) => !entityId || a.entityId === entityId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

/** Trail for a request and everything raised from it (RFQs, quotes, PO). */
export const getRequestAuditTrail = (requestId) => {
  const related = new Set([requestId]);
  rfqs.filter((r) => r.requestId === requestId).forEach((r) => related.add(r.id));
  quotations.filter((q) => q.requestId === requestId).forEach((q) => related.add(q.id));
  purchaseOrders.filter((po) => po.requestId === requestId).forEach((po) => related.add(po.id));
  return auditLogs
    .filter((a) => related.has(a.entityId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getAuditLogs = ({ entity, action, userId, search } = {}) =>
  auditLogs
    .filter((a) => !entity || a.entity === entity)
    .filter((a) => !action || a.action === action)
    .filter((a) => !userId || a.userId === userId)
    .filter((a) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [a.entityId, a.userName, a.action, a.remarks]
        .some((v) => String(v || '').toLowerCase().includes(q));
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// ── Approval chain ───────────────────────────────────────────
export const CHAIN = ['manager', 'senior_manager', 'head'];

/** Levels required for an amount, straight from the configured approval rules. */
export const approvalLevelsFor = (amount) => {
  const value = Number(amount) || 0;
  const rule = approvalRules.find((r) => value >= r.minAmount && value <= r.maxAmount);
  return rule?.levels?.length ? rule.levels : ['manager'];
};

export const statusForLevel = (role) => `pending_${role}`;
export const roleForStatus = (status) => {
  if (!status?.startsWith('pending_')) return null;
  const role = status.slice('pending_'.length);
  return CHAIN.includes(role) ? role : null;
};

export const EDITABLE_STATUSES = ['draft', 'returned'];
export const isRequestEditable = (request, user) =>
  !!request && !!user && request.createdBy === user.id && EDITABLE_STATUSES.includes(request.status);

export const canUserActOn = (request, user) =>
  !!request && !!user && roleForStatus(request.status) === user.role;

const stamp = () => new Date().toISOString();

const addHistory = (requestId, user, action, comments) => {
  const record = {
    id: nextId('AH', approvalHistory),
    requestId,
    approverName: user?.name || 'System',
    approverRole: user?.role || 'system',
    action,
    comments: comments || '',
    timestamp: stamp(),
  };
  approvalHistory.push(record);
  return record;
};

export const getRequest = (id) => requests.find((r) => r.id === id);
export const getApprovalHistory = (id) => approvalHistory.filter((h) => h.requestId === id);

// ── Request lifecycle ────────────────────────────────────────
export const createRequest = (data, user, { submit = false } = {}) => {
  // Item/category integrity: a laptop can only be raised under
  // Equipment & Assets → Laptop, and so on for every known item type.
  const categoryError = validateItemCategory(data);
  if (categoryError) throw new Error(categoryError);

  const request = {
    id: `REQ-2024-${String(requests.length + 1).padStart(3, '0')}`,
    status: 'draft',
    priority: 'medium',
    ...data,
    quantity: Number(data.quantity) || 1,
    estimatedCost: Number(data.estimatedCost) || 0,
    department: data.department || user?.department || '',
    createdBy: user?.id,
    createdAt: stamp(),
    updatedAt: stamp(),
    procurementStage: null,
    selectedQuotationId: null,
    selectedSupplierId: null,
    selectedSupplierName: null,
    poId: null,
  };
  requests.push(request);
  recordAudit({
    user,
    action: 'CREATE_REQUEST',
    entity: 'Request',
    entityId: request.id,
    updatedValue: 'draft',
    remarks: `${request.title} (${request.category} → ${request.subcategory || '—'}), qty ${request.quantity}, ₹${request.estimatedCost}`,
  });
  emitChange();
  if (submit) submitRequest(request.id, user);
  return request;
};

export const updateRequest = (id, data, user) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  if (!EDITABLE_STATUSES.includes(request.status)) {
    throw new Error(`Only draft or returned requests can be edited (current: ${request.status})`);
  }
  const categoryError = validateItemCategory({
    title: data.title ?? request.title,
    category: data.category ?? request.category,
    subcategory: data.subcategory ?? request.subcategory,
  });
  if (categoryError) throw new Error(categoryError);

  const before = `${request.title} | ${request.category} → ${request.subcategory} | qty ${request.quantity} | ₹${request.estimatedCost}`;
  Object.assign(request, {
    ...data,
    quantity: Number(data.quantity) || request.quantity,
    estimatedCost: Number(data.estimatedCost) || request.estimatedCost,
    updatedAt: stamp(),
  });
  recordAudit({
    user,
    action: 'UPDATE_REQUEST',
    entity: 'Request',
    entityId: request.id,
    previousValue: before,
    updatedValue: `${request.title} | ${request.category} → ${request.subcategory} | qty ${request.quantity} | ₹${request.estimatedCost}`,
    remarks: request.status === 'returned' ? 'Returned request corrected by requester' : 'Draft updated',
  });
  emitChange();
  return request;
};

/** Submit (or resubmit a corrected/returned) request into the approval chain. */
export const submitRequest = (id, user) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  if (!EDITABLE_STATUSES.includes(request.status)) {
    throw new Error(`Only draft or returned requests can be submitted (current: ${request.status})`);
  }
  const resubmission = request.status === 'returned';
  const previousStatus = request.status;
  const [firstLevel] = approvalLevelsFor(request.estimatedCost);

  request.status = statusForLevel(firstLevel);
  request.updatedAt = stamp();
  // Clear the correction trail once the request is back in the chain.
  request.returnComments = null;
  request.returnedBy = null;
  request.returnedByRole = null;
  request.returnedAt = null;
  request.returnedFromStatus = null;

  if (resubmission) addHistory(id, user, 'resubmitted', 'Corrected and resubmitted by requester.');
  recordAudit({
    user,
    action: resubmission ? 'RESUBMIT_REQUEST' : 'SUBMIT_REQUEST',
    entity: 'Request',
    entityId: request.id,
    previousValue: previousStatus,
    updatedValue: request.status,
    remarks: `Approval chain: ${approvalLevelsFor(request.estimatedCost).join(' → ')}`,
  });

  pushToRoles([firstLevel], {
    type: 'pending_approval',
    title: resubmission ? 'Corrected Request Resubmitted' : 'New Approval Request',
    message: `${request.id} (${request.title}) requires your approval.`,
    link: '/approvals',
  });
  emitChange();
  return request;
};

export const approveRequest = (id, user, comments) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  const currentRole = roleForStatus(request.status);
  if (!currentRole) throw new Error('This request is not awaiting approval.');
  if (user?.role !== currentRole) {
    throw new Error(`This request is awaiting the ${currentRole.replace('_', ' ')} approval.`);
  }

  const levels = approvalLevelsFor(request.estimatedCost);
  const index = levels.indexOf(currentRole);
  const nextRole = index >= 0 && index + 1 < levels.length ? levels[index + 1] : null;

  const previousStatus = request.status;
  request.status = nextRole ? statusForLevel(nextRole) : 'approved';
  request.updatedAt = stamp();
  addHistory(id, user, 'approved', comments);
  recordAudit({
    user,
    action: 'APPROVE_REQUEST',
    entity: 'Request',
    entityId: request.id,
    previousValue: previousStatus,
    updatedValue: request.status,
    remarks: comments || (nextRole ? `Approved, forwarded to ${nextRole.replace('_', ' ')}` : 'Final approval granted'),
  });

  if (nextRole) {
    pushToRoles([nextRole], {
      type: 'pending_approval',
      title: 'New Approval Request',
      message: `${request.id} (${request.title}) requires your approval.`,
      link: '/approvals',
    });
    pushNotification({
      userId: request.createdBy,
      type: 'request_approved',
      title: 'Approval Progress',
      message: `${request.id} was approved by the ${currentRole.replace('_', ' ')} and is now with the ${nextRole.replace('_', ' ')}.`,
      link: `/requests/${request.id}`,
    });
  } else {
    request.procurementStage = 'rfq_pending';
    pushNotification({
      userId: request.createdBy,
      type: 'request_approved',
      title: 'Request Approved',
      message: `${request.id} is fully approved and has moved to procurement.`,
      link: `/requests/${request.id}`,
    });
    // Route the approved request to the team designated for its category
    // (IT/software, facilities, equipment) plus central procurement.
    pushToRoles(['procurement_officer', teamForCategory(request.category)], {
      type: 'request_approved',
      title: 'Ready for Procurement',
      message: `${request.id} (${request.title}) is approved and ready for vendor sourcing by ${TEAM_LABELS[teamForCategory(request.category)]}.`,
      link: `/procurement/vendor-selection/${request.id}`,
    });
  }
  emitChange();
  return request;
};

export const rejectRequest = (id, user, comments) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  if (!roleForStatus(request.status)) throw new Error('This request is not awaiting approval.');
  const previousStatus = request.status;
  request.status = 'rejected';
  request.updatedAt = stamp();
  addHistory(id, user, 'rejected', comments);
  recordAudit({
    user,
    action: 'REJECT_REQUEST',
    entity: 'Request',
    entityId: request.id,
    previousValue: previousStatus,
    updatedValue: 'rejected',
    remarks: comments || 'Rejected',
  });
  pushNotification({
    userId: request.createdBy,
    type: 'request_rejected',
    title: 'Request Rejected',
    message: `${request.id} was rejected by ${user?.name}.${comments ? ` Reason: ${comments}` : ''}`,
    link: `/requests/${request.id}`,
  });
  emitChange();
  return request;
};

/**
 * Return a request to the requester. The request becomes an editable draft
 * again (status "returned") and keeps the reviewer's comments so it can be
 * corrected and resubmitted instead of recreated.
 */
export const returnRequest = (id, user, comments) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  if (!roleForStatus(request.status)) throw new Error('This request is not awaiting approval.');

  request.returnedFromStatus = request.status;
  request.status = 'returned';
  request.returnComments = comments || '';
  request.returnedBy = user?.name;
  request.returnedByRole = user?.role;
  request.returnedAt = stamp();
  request.updatedAt = stamp();
  addHistory(id, user, 'returned', comments);
  recordAudit({
    user,
    action: 'RETURN_REQUEST',
    entity: 'Request',
    entityId: request.id,
    previousValue: request.returnedFromStatus,
    updatedValue: 'returned',
    remarks: comments || 'Returned to requester for correction (draft re-opened for editing)',
  });

  pushNotification({
    userId: request.createdBy,
    type: 'request_returned',
    title: 'Request Returned for Correction',
    message: `${request.id} was returned by ${user?.name}. You can edit and resubmit it.${comments ? ` Note: ${comments}` : ''}`,
    link: `/requests/${request.id}/edit`,
  });
  emitChange();
  return request;
};

export const cancelRequest = (id, user) => {
  const request = getRequest(id);
  if (!request) throw new Error('Request not found');
  request.status = 'cancelled';
  request.updatedAt = stamp();
  addHistory(id, user, 'cancelled', 'Cancelled by requester.');
  recordAudit({
    user,
    action: 'CANCEL_REQUEST',
    entity: 'Request',
    entityId: request.id,
    updatedValue: 'cancelled',
    remarks: 'Cancelled by requester',
  });
  emitChange();
  return request;
};

// ── Procurement: RFQs ────────────────────────────────────────
export const getRequestRfqs = (requestId) => rfqs.filter((r) => r.requestId === requestId);
export const getRequestQuotations = (requestId) => quotations.filter((q) => q.requestId === requestId);

/** Procurement officer sends RFQs to the suppliers they picked. */
export const createRfqs = (requestId, supplierIds, options = {}) => {
  const request = getRequest(requestId);
  if (!request) throw new Error('Request not found');
  if (request.status !== 'approved') {
    throw new Error('RFQs can only be raised for fully approved requests.');
  }
  // Only the designated department team (or central procurement) may source.
  if (options.user) assertCanProcessCategory(options.user.role, request.category);
  if (!supplierIds?.length) throw new Error('Select at least one supplier.');

  const created = supplierIds.map((supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    const rfq = {
      id: `RFQ-2024-${String(rfqs.length + 1).padStart(3, '0')}`,
      rfqNumber: `RFQ-2024-${String(rfqs.length + 1).padStart(3, '0')}`,
      requestId,
      supplierId,
      supplierName: supplier?.companyName || supplierId,
      itemName: request.title,
      quantity: request.quantity,
      requiredDeliveryDate: request.requiredDate,
      deliveryLocation: options.deliveryLocation || 'Bangalore Office',
      submissionDeadline: options.submissionDeadline || request.requiredDate,
      category: request.category,
      productAvailability: 'Pending Check',
      status: 'pending',
      declineReason: null,
      declineRemarks: null,
      createdAt: stamp().split('T')[0],
    };
    rfqs.push(rfq);
    pushToSupplier(supplierId, {
      type: 'rfq_received',
      title: 'New RFQ Received',
      message: `${rfq.rfqNumber} for ${rfq.itemName} (qty ${rfq.quantity}). Submit your quotation by ${rfq.submissionDeadline}.`,
      link: '/supplier-portal',
    });
    return rfq;
  });

  request.procurementStage = 'rfq_pending';
  request.updatedAt = stamp();
  recordAudit({
    user: options.user,
    action: 'CREATE_RFQ',
    entity: 'Request',
    entityId: request.id,
    updatedValue: created.map((r) => r.rfqNumber).join(', '),
    remarks: `RFQ sent to ${created.map((r) => r.supplierName).join(', ')}`,
  });
  created.forEach((rfq) =>
    recordAudit({
      user: options.user,
      action: 'CREATE_RFQ',
      entity: 'Rfq',
      entityId: rfq.id,
      updatedValue: 'pending',
      remarks: `RFQ issued to ${rfq.supplierName} for ${rfq.itemName}`,
    }),
  );
  emitChange();
  return created;
};

// ── Procurement: quotations ──────────────────────────────────
/** Supplier submits a quotation against an RFQ. Finance review comes next. */
export const submitQuotation = (data) => {
  const rfq = rfqs.find((r) => r.id === data.rfqId);
  const supplier = suppliers.find((s) => s.id === data.supplierId);
  const items = data.items?.length ? data.items : [];
  const quantity = items[0]?.quantity || rfq?.quantity || 1;
  const unitPrice = Number(data.unitPrice) || items[0]?.unitPrice || 0;

  const quotation = {
    id: nextId('Q', quotations),
    rfqId: data.rfqId || null,
    requestId: data.requestId || rfq?.requestId || null,
    supplierId: data.supplierId,
    supplierName: data.supplierName || supplier?.companyName || data.supplierId,
    unitPrice,
    items,
    totalAmount: Number(data.totalAmount) || unitPrice * quantity,
    estimatedDeliveryTime: data.estimatedDeliveryTime || '',
    warranty: data.warranty || '',
    remarks: data.remarks || '',
    validUntil: data.validUntil || new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
    status: 'pending_finance',
    financeStatus: 'pending_finance',
    financeComments: null,
    financeReviewedBy: null,
    financeReviewedAt: null,
    selected: false,
    submittedAt: stamp(),
  };
  quotations.push(quotation);
  recordAudit({
    user: { id: quotation.supplierId, name: quotation.supplierName, role: 'supplier' },
    action: 'SUBMIT_QUOTATION',
    entity: 'Quotation',
    entityId: quotation.id,
    updatedValue: 'pending_finance',
    remarks: `Quotation of ₹${Math.round(quotation.totalAmount)} submitted for ${quotation.requestId}`,
  });

  if (rfq) rfq.status = 'quoted';
  const request = quotation.requestId ? getRequest(quotation.requestId) : null;
  if (request) request.procurementStage = 'finance_review';

  pushToRoles(['finance_officer'], {
    type: 'quotation_submitted',
    title: 'Quotation Awaiting Approval',
    message: `${quotation.supplierName} submitted a quotation of ₹${Math.round(quotation.totalAmount).toLocaleString('en-IN')} for ${quotation.requestId}.`,
    link: '/finance/quotations',
  });
  pushToRoles(['procurement_officer'], {
    type: 'quotation_submitted',
    title: 'New Quotation Received',
    message: `${quotation.supplierName} quoted ₹${Math.round(quotation.totalAmount).toLocaleString('en-IN')} for ${quotation.requestId}.`,
    link: `/procurement/vendor-selection/${quotation.requestId}`,
  });
  emitChange();
  return quotation;
};

export const getQuotationsForFinance = (financeStatus = 'pending_finance') =>
  quotations.filter((q) => (financeStatus ? q.financeStatus === financeStatus : true));

/** Finance approves or rejects a supplier quotation. */
export const reviewQuotation = (quotationId, { approve, comments, user }) => {
  const quotation = quotations.find((q) => q.id === quotationId);
  if (!quotation) throw new Error('Quotation not found');
  if (quotation.financeStatus !== 'pending_finance') {
    throw new Error(`Quotation was already reviewed by finance (${quotation.financeStatus}).`);
  }
  quotation.financeStatus = approve ? 'approved' : 'rejected';
  quotation.status = approve ? 'finance_approved' : 'rejected';
  quotation.financeComments = comments || '';
  quotation.financeReviewedBy = user?.name || 'Finance Officer';
  quotation.financeReviewedAt = stamp();
  recordAudit({
    user,
    action: approve ? 'APPROVE_QUOTATION' : 'REJECT_QUOTATION',
    entity: 'Quotation',
    entityId: quotation.id,
    previousValue: 'pending_finance',
    updatedValue: quotation.financeStatus,
    remarks: comments || `Finance ${approve ? 'approved' : 'rejected'} ${quotation.supplierName}'s quotation for ${quotation.requestId}`,
  });

  const request = getRequest(quotation.requestId);
  if (request && approve) request.procurementStage = 'quotations_received';

  pushToRoles(['procurement_officer'], {
    type: approve ? 'quotation_approved' : 'quotation_rejected',
    title: approve ? 'Quotation Approved by Finance' : 'Quotation Rejected by Finance',
    message: `${quotation.id} from ${quotation.supplierName} for ${quotation.requestId} was ${approve ? 'approved — you can now select the vendor' : 'rejected by finance'}.`,
    link: approve ? `/procurement/vendor-selection/${quotation.requestId}` : '/procurement',
  });
  pushToSupplier(quotation.supplierId, {
    type: approve ? 'quotation_approved' : 'quotation_rejected',
    title: approve ? 'Quotation Cleared' : 'Quotation Rejected',
    message: `Your quotation ${quotation.id} was ${approve ? 'approved' : 'rejected'} during finance review.`,
    link: '/supplier-portal',
  });
  emitChange();
  return quotation;
};

// ── Procurement: vendor selection ────────────────────────────
/**
 * Procurement officer awards the request to a vendor. Only finance-approved
 * quotations are eligible; the purchase order is raised automatically.
 */
export const selectVendor = (quotationId, user, options = {}) => {
  const winner = quotations.find((q) => q.id === quotationId);
  if (!winner) throw new Error('Quotation not found');
  if (winner.financeStatus !== 'approved') {
    throw new Error('Only finance-approved quotations can be awarded.');
  }
  const request = getRequest(winner.requestId);
  if (!request) throw new Error('Linked request not found');
  if (!['approved', 'in_procurement'].includes(request.status)) {
    throw new Error('Only fully approved requests can be awarded to a vendor.');
  }
  if (request.selectedQuotationId) {
    throw new Error(`A vendor has already been selected for ${request.id}.`);
  }
  // Central procurement, or the department team that owns this category.
  if (user?.role) assertCanProcessCategory(user.role, request.category);

  winner.selected = true;
  winner.status = 'accepted';
  quotations
    .filter((q) => q.requestId === winner.requestId && q.id !== winner.id)
    .forEach((q) => {
      q.selected = false;
      if (q.status !== 'rejected') q.status = 'not_selected';
      pushToSupplier(q.supplierId, {
        type: 'quotation_rejected',
        title: 'Quotation Not Selected',
        message: `Your quotation ${q.id} for ${q.requestId} was not selected.`,
        link: '/supplier-portal',
      });
    });

  const items = (winner.items?.length
    ? winner.items
    : [{ name: request.title, unitPrice: winner.unitPrice, quantity: request.quantity || 1 }]
  ).map((i) => ({
    name: i.name,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    total: i.unitPrice * i.quantity,
  }));
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const tax = Math.round(subtotal * 0.18);
  const po = {
    id: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
    requestId: request.id,
    supplierId: winner.supplierId,
    supplierName: winner.supplierName,
    items,
    subtotal,
    tax,
    totalAmount: subtotal + tax,
    deliveryDate: options.deliveryDate || request.requiredDate,
    status: 'pending_finance',
    createdAt: stamp().split('T')[0],
    createdBy: user?.id,
  };
  po.ownerTeam = teamForCategory(request.category);
  po.category = request.category;
  po.department = request.department;
  po.history = [];
  purchaseOrders.push(po);

  recordAudit({
    user,
    action: 'SELECT_VENDOR',
    entity: 'Quotation',
    entityId: winner.id,
    previousValue: 'finance_approved',
    updatedValue: 'accepted',
    remarks: `${winner.supplierName} awarded ${request.id} at ₹${Math.round(winner.totalAmount)} by ${TEAM_LABELS[user?.role] || user?.role || 'procurement'}`,
  });
  recordAudit({
    user,
    action: 'CREATE_PO',
    entity: 'PurchaseOrder',
    entityId: po.id,
    updatedValue: po.status,
    remarks: `${po.id} raised for ${request.id} (${po.supplierName}) — ₹${po.totalAmount}. Owner: ${TEAM_LABELS[po.ownerTeam]}`,
  });

  request.selectedQuotationId = winner.id;
  request.selectedSupplierId = winner.supplierId;
  request.selectedSupplierName = winner.supplierName;
  request.poId = po.id;
  request.procurementStage = 'po_finance_review';
  request.status = 'in_procurement';
  request.updatedAt = stamp();

  pushNotification({
    userId: request.createdBy,
    type: 'po_created',
    title: 'Vendor Selected',
    message: `${winner.supplierName} was selected for ${request.id}. ${po.id} has been raised and sent to finance for approval.`,
    link: `/requests/${request.id}`,
  });
  pushToRoles(['finance_officer'], {
    type: 'po_pending_finance',
    title: 'Purchase Order Awaiting Finance Approval',
    message: `${po.id} for ${request.id} (${winner.supplierName}) — ₹${Math.round(po.totalAmount).toLocaleString('en-IN')} needs your approval.`,
    link: `/purchase-orders/${po.id}`,
  });
  emitChange();
  return { quotation: winner, purchaseOrder: po, request };
};

/** Requests waiting on the procurement team, with their sourcing stage. */
export const getProcurementQueue = () =>
  requests
    .filter((r) => ['approved', 'in_procurement'].includes(r.status))
    .map((r) => {
      const reqRfqs = getRequestRfqs(r.id);
      const reqQuotes = getRequestQuotations(r.id);
      const approvedQuotes = reqQuotes.filter((q) => q.financeStatus === 'approved');
      let stage = 'rfq_pending';
      if (r.selectedQuotationId) stage = 'po_created';
      else if (approvedQuotes.length) stage = 'vendor_selection';
      else if (reqQuotes.length) stage = 'finance_review';
      else if (reqRfqs.length) stage = 'awaiting_quotations';
      return { request: r, rfqs: reqRfqs, quotations: reqQuotes, stage };
    });

export const STAGE_LABELS = {
  rfq_pending: 'RFQ Pending',
  awaiting_quotations: 'Awaiting Quotations',
  finance_review: 'Finance Review',
  vendor_selection: 'Vendor Selection',
  po_created: 'PO Issued',
};

// ── Purchase order processing ────────────────────────────────
/**
 * A purchase order is processed by the team that owns the request's
 * category — the IT/software team for software, the facilities team for
 * facilities work, the equipment team for hardware — or by central
 * procurement, which can process everything. Each move follows the PO
 * state machine (draft → sent → accepted → in_transit → delivered → closed)
 * and is written to the audit trail.
 */
export const getPurchaseOrder = (id) => purchaseOrders.find((po) => po.id === id);

/** The team that owns a PO (falls back to the linked request's category). */
export const poOwnerTeam = (po) => {
  if (!po) return 'procurement_officer';
  if (po.ownerTeam) return po.ownerTeam;
  const request = po.requestId ? getRequest(po.requestId) : null;
  return teamForCategory(request?.category || po.category);
};

export const poCategory = (po) => {
  if (!po) return null;
  const request = po.requestId ? getRequest(po.requestId) : null;
  return request?.category || po.category || null;
};

/**
 * Can this role process (progress/cancel) this purchase order?
 * Finance owns the approval gate while the PO is awaiting approval;
 * procurement (central or the designated department team) owns the rest.
 */
export const canProcessPo = (po, user) => {
  if (!po || !user) return false;
  if (FINANCE_PO_STATUSES.includes(po.status)) {
    return ['finance_officer', 'admin'].includes(user.role);
  }
  return canProcessCategory(user.role, poCategory(po));
};

/** Purchase orders a role is allowed to work on. */
export const getPurchaseOrdersForUser = (user, { status } = {}) =>
  purchaseOrders
    .filter((po) => (status ? po.status === status : true))
    .filter((po) => !user || canProcessPo(po, user) || user.role === 'finance_officer');

/** Actions available to this user on this purchase order. */
export const availablePoActions = (po, user) => {
  if (!canProcessPo(po, user)) return [];
  return nextPoStatuses(po.status)
    .filter((status) => canRoleTransitionPo(user.role, status))
    .map((status) => ({
      status,
      label: PO_ACTION_LABELS[status] || status,
    }));
};

const PO_STAGE_MESSAGES = {
  pending_finance: 'Purchase order sent to finance for approval.',
  finance_approved: 'Finance approved the purchase order — procurement can now issue it to the supplier.',
  finance_rejected: 'Finance rejected the purchase order.',
  sent: 'Purchase order issued to the supplier.',
  accepted: 'Supplier acknowledged the purchase order.',
  in_transit: 'Goods dispatched by the supplier.',
  delivered: 'Goods delivered — awaiting goods receipt / verification.',
  closed: 'Purchase order closed.',
  cancelled: 'Purchase order cancelled.',
};

/** Progress a purchase order through its lifecycle. */
export const processPurchaseOrder = (poId, nextStatus, user, remarks = '') => {
  const po = getPurchaseOrder(poId);
  if (!po) throw new Error('Purchase order not found');
  if (!canProcessPo(po, user)) {
    throw new Error(
      `Only ${TEAM_LABELS[poOwnerTeam(po)]} or central procurement can process ${po.id}.`,
    );
  }
  if (!canTransitionPo(po.status, nextStatus)) {
    throw new Error(`${po.id} cannot move from ${po.status} to ${nextStatus}.`);
  }
  if (!canRoleTransitionPo(user?.role, nextStatus)) {
    const owners = (rolesForPoTransition(nextStatus) || [])
      .filter((r) => r !== 'admin')
      .map((r) => TEAM_LABELS[r] || r.replace(/_/g, ' '))
      .join(' / ');
    recordAudit({
      user,
      action: 'PROCESS_PO_REJECTED',
      entity: 'PurchaseOrder',
      entityId: po.id,
      previousValue: po.status,
      updatedValue: nextStatus,
      remarks: `Blocked: only ${owners} can move ${po.id} to ${nextStatus}.`,
    });
    throw new Error(`Only ${owners} can move ${po.id} to ${nextStatus.replace(/_/g, ' ')}.`);
  }

  const previousStatus = po.status;
  po.status = nextStatus;
  po.updatedAt = stamp();
  po.ownerTeam = poOwnerTeam(po);
  po.history = [
    ...(po.history || []),
    {
      status: nextStatus,
      by: user?.name || 'System',
      role: user?.role || 'system',
      at: stamp(),
      remarks: remarks || '',
    },
  ];

  const request = po.requestId ? getRequest(po.requestId) : null;
  if (request) {
    if (nextStatus === 'pending_finance') {
      request.procurementStage = 'po_finance_review';
    } else if (nextStatus === 'finance_approved') {
      request.procurementStage = 'po_finance_approved';
    } else if (nextStatus === 'delivered') {
      request.status = 'delivered';
      request.procurementStage = 'delivered';
    } else if (nextStatus === 'closed') {
      request.status = 'closed';
      request.procurementStage = 'closed';
    } else if (nextStatus === 'cancelled') {
      request.procurementStage = 'po_cancelled';
    } else {
      request.procurementStage = 'po_created';
    }
    request.updatedAt = stamp();
  }

  recordAudit({
    user,
    action: 'PROCESS_PO',
    entity: 'PurchaseOrder',
    entityId: po.id,
    previousValue: previousStatus,
    updatedValue: nextStatus,
    remarks: remarks || PO_STAGE_MESSAGES[nextStatus] || `Status changed to ${nextStatus}`,
  });

  if (nextStatus === 'pending_finance') {
    pushToRoles(['finance_officer'], {
      type: 'po_pending_finance',
      title: 'Purchase Order Awaiting Finance Approval',
      message: `${po.id} (₹${Math.round(po.totalAmount).toLocaleString('en-IN')}) needs finance approval.`,
      link: `/purchase-orders/${po.id}`,
    });
  }

  if (nextStatus === 'finance_approved' || nextStatus === 'finance_rejected') {
    // Finance decision goes back to the procurement officer and the owning team.
    pushToRoles(['procurement_officer', poOwnerTeam(po)], {
      type: nextStatus === 'finance_approved' ? 'po_finance_approved' : 'po_finance_rejected',
      title:
        nextStatus === 'finance_approved'
          ? 'Purchase Order Approved by Finance'
          : 'Purchase Order Rejected by Finance',
      message:
        nextStatus === 'finance_approved'
          ? `${po.id} was approved by finance — issue it to ${po.supplierName} to start processing.`
          : `${po.id} was rejected by finance. ${remarks || ''}`.trim(),
      link: `/purchase-orders/${po.id}`,
    });
  }

  if (nextStatus === 'sent') {
    pushToSupplier(po.supplierId, {
      type: 'po_created',
      title: 'Purchase Order Received',
      message: `${po.id} has been issued to you by procurement for processing.`,
      link: '/supplier-portal',
    });
  } else if (!['pending_finance', 'finance_approved', 'finance_rejected'].includes(nextStatus)) {
    pushToSupplier(po.supplierId, {
      type: 'po_updated',
      title: `Purchase Order ${nextStatus.replace('_', ' ')}`,
      message: `${po.id} is now ${nextStatus.replace('_', ' ')}. ${PO_STAGE_MESSAGES[nextStatus] || ''}`,
      link: '/supplier-portal',
    });
  }
  if (request?.createdBy) {
    pushNotification({
      userId: request.createdBy,
      type: 'po_updated',
      title: `Order Update — ${po.id}`,
      message: `${request.title}: ${PO_STAGE_MESSAGES[nextStatus] || nextStatus}`,
      link: `/requests/${request.id}`,
    });
  }
  if (['delivered', 'closed', 'cancelled'].includes(nextStatus)) {
    pushToRoles(['finance_officer'], {
      type: 'po_updated',
      title: `Purchase Order ${nextStatus}`,
      message: `${po.id} (₹${Math.round(po.totalAmount).toLocaleString('en-IN')}) is ${nextStatus}.`,
      link: `/purchase-orders/${po.id}`,
    });
  }
  emitChange();
  return po;
};

/** Progress view of a PO for the timeline UI. */
export const poProgress = (po) => {
  const index = PO_STAGE_ORDER.indexOf(po?.status);
  return PO_STAGE_ORDER.map((stage, i) => ({
    stage,
    done: index >= 0 && i <= index,
    current: stage === po?.status,
  }));
};

/** Queue for a department team: requests and POs in their category. */
export const getDepartmentWorkload = (user) => {
  const owned = (category) => canProcessCategory(user?.role, category);
  return {
    sourcing: getProcurementQueue().filter((row) => owned(row.request.category)),
    purchaseOrders: purchaseOrders.filter((po) => owned(poCategory(po))),
  };
};


/** Purchase orders awaiting the finance approval gate. */
export const getPurchaseOrdersForFinance = (status = 'pending_finance') =>
  purchaseOrders.filter((po) => po.status === status);

/** Finance approves / rejects a purchase order before it reaches the supplier. */
export const reviewPurchaseOrder = (poId, { approve, comments = '', user }) => {
  if (!['finance_officer', 'admin'].includes(user?.role)) {
    throw new Error('Only finance can approve purchase orders.');
  }
  const po = processPurchaseOrder(
    poId,
    approve ? 'finance_approved' : 'finance_rejected',
    user,
    comments,
  );
  po.financeStatus = approve ? 'approved' : 'rejected';
  po.financeComments = comments;
  po.financeReviewedBy = user?.name;
  po.financeReviewedAt = stamp();
  emitChange();
  return po;
};

/** Procurement officer issues a finance-approved PO to the supplier. */
export const issuePurchaseOrderToSupplier = (poId, user, remarks = '') => {
  const po = getPurchaseOrder(poId);
  if (!po) throw new Error('Purchase order not found');
  if (po.status !== 'finance_approved') {
    throw new Error(`${po.id} must be approved by finance before it can be issued to the supplier.`);
  }
  return processPurchaseOrder(poId, 'sent', user, remarks || 'Issued to supplier by procurement.');
};

// ── Users & role assignment ──────────────────────────────────
export const getUsers = () => users;
export const getUser = (id) => users.find((u) => u.id === id);

/**
 * Admin assigns a role to a user. The user's dashboard and permissions
 * follow the newly assigned role immediately (the session is refreshed
 * through the change bus when the affected user is signed in).
 */
export const assignRole = (userId, role, actor) => {
  if (actor && !['admin'].includes(actor.role)) {
    throw new Error('Only an administrator can assign roles.');
  }
  const user = getUser(userId);
  if (!user) throw new Error('User not found');
  if (!role) throw new Error('Please select a role');
  const previous = user.role;
  user.role = role;
  user.updatedAt = stamp();

  recordAudit({
    user: actor,
    action: 'ASSIGN_ROLE',
    entity: 'User',
    entityId: user.id,
    previousValue: previous,
    updatedValue: role,
    remarks: `${user.name} reassigned from ${previous.replace(/_/g, ' ')} to ${role.replace(/_/g, ' ')}`,
  });

  pushNotification({
    userId: user.id,
    type: 'role_assigned',
    title: 'Your Role Was Updated',
    message: `You are now a ${role.replace(/_/g, ' ')}. Your dashboard and permissions have been updated.`,
    link: '/dashboard',
  });

  emitChange();
  return user;
};

/** Create or update a user record (admin user management). */
export const saveUser = (data, actor, existingId = null) => {
  if (existingId) {
    const user = getUser(existingId);
    if (!user) throw new Error('User not found');
    const previousRole = user.role;
    Object.assign(user, data, { updatedAt: stamp() });
    recordAudit({
      user: actor,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: user.id,
      previousValue: previousRole,
      updatedValue: user.role,
      remarks: `${user.name} updated by ${actor?.name || 'admin'}`,
    });
    if (previousRole !== user.role) assignRole(user.id, user.role, actor);
    emitChange();
    return user;
  }
  const user = {
    id: `U${String(users.length + 1).padStart(3, '0')}`,
    status: 'active',
    avatar: `hsl(${Math.floor(Math.random() * 360)}, 60%, 55%)`,
    createdAt: stamp().split('T')[0],
    ...data,
  };
  users.push(user);
  recordAudit({
    user: actor,
    action: 'CREATE_USER',
    entity: 'User',
    entityId: user.id,
    updatedValue: user.role,
    remarks: `${user.name} created as ${String(user.role).replace(/_/g, ' ')}`,
  });
  emitChange();
  return user;
};

/** Register a self-service account with the role chosen at sign-up. */
export const registerUser = ({ name, email, password, department, role = 'employee' }) => {
  if (!name || !email || !password) throw new Error('All fields are required');
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw new Error('An account with this email already exists');
  }
  return saveUser(
    {
      name,
      email,
      role,
      department: department || 'Engineering',
      phone: '',
      status: 'active',
    },
    null,
  );
};

export const setUserStatus = (userId, status, actor) => {
  const user = getUser(userId);
  if (!user) throw new Error('User not found');
  const previous = user.status;
  user.status = status;
  recordAudit({
    user: actor,
    action: 'UPDATE_USER_STATUS',
    entity: 'User',
    entityId: user.id,
    previousValue: previous,
    updatedValue: status,
    remarks: `${user.name} set to ${status}`,
  });
  emitChange();
  return user;
};
