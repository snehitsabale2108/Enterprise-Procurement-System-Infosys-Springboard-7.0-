import { apiCall, isMockMode } from './apiConfig';
import { rfqs as mockRfqs, quotations as mockQuotations, purchaseOrders as mockPos, suppliers as mockSuppliers } from '../data/mockData';

/**
 * GET /suppliers/portal/dashboard/:supplierId
 */
export const getSupplierPortalStats = async (supplierId) => {
  if (!isMockMode()) {
    return apiCall(`/suppliers/portal/dashboard/${supplierId}`);
  }

  const myRfqs = mockRfqs.filter(r => r.supplierId === supplierId);
  const myQuotations = mockQuotations.filter(q => q.supplierId === supplierId);
  const myPos = mockPos.filter(po => po.supplierId === supplierId);

  return {
    pendingRfqs: myRfqs.filter(r => r.status === 'pending').length,
    submittedQuotations: myQuotations.length,
    purchaseOrdersReceived: myPos.length,
    activeOrders: myPos.filter(po => ['accepted', 'processing', 'packed', 'shipped'].includes(po.status)).length,
    completedOrders: myPos.filter(po => ['delivered', 'closed'].includes(po.status)).length,
  };
};

/**
 * GET /rfqs?supplierId=:supplierId
 */
export const getSupplierRfqs = async (supplierId, statusFilter = '') => {
  if (!isMockMode()) {
    const params = new URLSearchParams();
    if (supplierId) params.append('supplierId', supplierId);
    if (statusFilter) params.append('status', statusFilter);
    return apiCall(`/rfqs?${params.toString()}`);
  }

  let list = mockRfqs.filter(r => r.supplierId === supplierId);
  if (statusFilter) {
    list = list.filter(r => r.status === statusFilter);
  }
  return { content: list, totalElements: list.length };
};

/**
 * PATCH /rfqs/:id/availability
 */
export const updateProductAvailability = async (rfqId, productAvailability) => {
  if (!isMockMode()) {
    return apiCall(`/rfqs/${rfqId}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ productAvailability }),
    });
  }

  const rfq = mockRfqs.find(r => r.id === rfqId);
  if (rfq) {
    rfq.productAvailability = productAvailability;
  }
  return rfq;
};

/**
 * POST /rfqs/:id/decline
 */
export const declineRfq = async (rfqId, declineReason, declineRemarks) => {
  if (!isMockMode()) {
    return apiCall(`/rfqs/${rfqId}/decline`, {
      method: 'POST',
      body: JSON.stringify({ declineReason, declineRemarks }),
    });
  }

  const rfq = mockRfqs.find(r => r.id === rfqId);
  if (rfq) {
    rfq.status = 'declined';
    rfq.productAvailability = 'Out of Stock';
    rfq.declineReason = declineReason;
    rfq.declineRemarks = declineRemarks;
  }
  return rfq;
};

/**
 * POST /quotations
 */
export const submitQuotation = async (quotationData) => {
  if (!isMockMode()) {
    return apiCall('/quotations', {
      method: 'POST',
      body: JSON.stringify(quotationData),
    });
  }

  const newQ = {
    id: `Q${String(mockQuotations.length + 1).padStart(3, '0')}`,
    status: 'pending',
    submittedAt: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ...quotationData,
  };
  mockQuotations.push(newQ);

  if (quotationData.rfqId) {
    const rfq = mockRfqs.find(r => r.id === quotationData.rfqId);
    if (rfq) rfq.status = 'quoted';
  }

  return newQ;
};

/**
 * GET /quotations?supplierId=:supplierId
 */
export const getSupplierQuotations = async (supplierId, statusFilter = '') => {
  if (!isMockMode()) {
    return apiCall(`/quotations?supplierId=${supplierId}&status=${statusFilter}`);
  }

  let list = mockQuotations.filter(q => q.supplierId === supplierId);
  if (statusFilter) {
    list = list.filter(q => q.status === statusFilter);
  }
  return list;
};

/**
 * GET /purchase-orders?supplierId=:supplierId
 */
export const getSupplierPurchaseOrders = async (supplierId, statusFilter = '') => {
  if (!isMockMode()) {
    return apiCall(`/purchase-orders?supplierId=${supplierId}&status=${statusFilter}`);
  }

  let list = mockPos.filter(po => po.supplierId === supplierId);
  if (statusFilter) {
    list = list.filter(po => po.status === statusFilter);
  }
  return { content: list, totalElements: list.length };
};

/**
 * POST /purchase-orders/:id/accept
 */
export const acceptPurchaseOrder = async (poId) => {
  if (!isMockMode()) {
    return apiCall(`/purchase-orders/${poId}/accept`, { method: 'POST' });
  }

  const po = mockPos.find(p => p.id === poId);
  if (po) {
    po.status = 'accepted';
  }
  return po;
};

/**
 * POST /purchase-orders/:id/reject
 */
export const rejectPurchaseOrder = async (poId, reason) => {
  if (!isMockMode()) {
    return apiCall(`/purchase-orders/${poId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  const po = mockPos.find(p => p.id === poId);
  if (po) {
    po.status = 'rejected';
    po.reclineReason = reason;
  }
  return po;
};

/**
 * PATCH /purchase-orders/:id/status
 */
export const updateOrderStatus = async (poId, status) => {
  if (!isMockMode()) {
    return apiCall(`/purchase-orders/${poId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  const po = mockPos.find(p => p.id === poId);
  if (po) {
    po.status = status;
  }
  return { message: 'Status updated', newStatus: status };
};

/**
 * POST /purchase-orders/:id/invoice
 */
export const uploadInvoice = async (poId, invoiceData) => {
  if (!isMockMode()) {
    return apiCall(`/purchase-orders/${poId}/invoice`, {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  const po = mockPos.find(p => p.id === poId);
  if (po) {
    po.invoiceNumber = invoiceData.invoiceNumber;
    po.invoiceAmount = invoiceData.invoiceAmount || po.totalAmount;
    po.invoiceFileName = invoiceData.invoiceFileName || `INV_${poId}.pdf`;
    po.invoiceUploadedAt = new Date().toISOString().split('T')[0];
  }
  return po;
};

/**
 * GET /suppliers/portal/profile/:supplierId
 */
export const getSupplierProfile = async (supplierId) => {
  if (!isMockMode()) {
    return apiCall(`/suppliers/portal/profile/${supplierId}`);
  }

  return mockSuppliers.find(s => s.id === supplierId);
};

/**
 * PUT /suppliers/portal/profile/:supplierId
 */
export const updateSupplierProfile = async (supplierId, profileData) => {
  if (!isMockMode()) {
    return apiCall(`/suppliers/portal/profile/${supplierId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  const idx = mockSuppliers.findIndex(s => s.id === supplierId);
  if (idx > -1) {
    mockSuppliers[idx] = { ...mockSuppliers[idx], ...profileData };
    return mockSuppliers[idx];
  }
  return null;
};
