/**
 * End-to-end workflow test (no DOM): request -> approval chain -> return &
 * resubmit -> RFQ -> quotation -> finance approval -> vendor selection by the
 * designated department team -> purchase order processing -> audit trail.
 * Run with: npx vitest run
 */
import { describe, it, expect } from 'vitest';
import * as store from '../epsStore';
import { validateItemCategory, canProcessCategory } from '../procurementPolicy';

const employee = { id: 'U001', name: 'Ravi Kumar', role: 'employee', department: 'IT' };
const manager = { id: 'U003', name: 'Anand Mehta', role: 'manager' };
const seniorManager = { id: 'U004', name: 'Deepa Nair', role: 'senior_manager' };
const finance = { id: 'U010', name: 'Lakshmi Iyer', role: 'finance_officer' };
const softwareTeam = { id: 'U008', name: 'Kavita Joshi', role: 'software_team' };
const facilitiesTeam = { id: 'U009', name: 'Arun Gupta', role: 'facilities_team' };

describe('item category integrity', () => {
  it('rejects a laptop raised outside the laptop category', () => {
    expect(validateItemCategory({ title: 'Dell Laptop', category: 'Facilities', subcategory: 'Furniture' })).toBeTruthy();
    expect(() => store.createRequest({ title: 'Dell Laptop', category: 'Facilities', subcategory: 'Furniture', estimatedCost: 90000 }, employee)).toThrow();
  });
  it('accepts a laptop under Equipment & Assets -> Laptop', () => {
    expect(validateItemCategory({ title: 'Dell Laptop', category: 'Equipment & Assets', subcategory: 'Laptop' })).toBeNull();
  });
});

describe('full procurement lifecycle', () => {
  it('runs request -> return -> resubmit -> award -> PO processing with a full audit trail', () => {
    const req = store.createRequest(
      { title: 'Jira Software Cloud subscription', category: 'Software & Digital Services', subcategory: 'SaaS Subscription', description: 'd', reason: 'r', quantity: 1, estimatedCost: 90000 },
      employee,
      { submit: true },
    );
    expect(req.status).toBe('pending_manager');

    store.returnRequest(req.id, manager, 'Add comparative quotes');
    expect(store.getRequest(req.id).status).toBe('returned');
    expect(store.isRequestEditable(store.getRequest(req.id), employee)).toBe(true);

    store.updateRequest(req.id, { estimatedCost: 88000 }, employee);
    store.submitRequest(req.id, employee);
    store.approveRequest(req.id, manager, 'ok');
    // Amount needs a second level: the chain moves on instead of finishing.
    expect(store.getRequest(req.id).status).toBe('pending_senior_manager');
    store.approveRequest(req.id, seniorManager, 'ok');
    expect(store.getRequest(req.id).status).toBe('approved');

    store.createRfqs(req.id, ['S002'], { user: softwareTeam });
    const quote = store.submitQuotation({ rfqId: store.getRequestRfqs(req.id)[0].id, supplierId: 'S002', unitPrice: 90000, items: [{ name: 'Jira', quantity: 1, unitPrice: 90000 }] });
    store.reviewQuotation(quote.id, { approve: true, comments: 'within budget', user: finance });

    expect(() => store.selectVendor(quote.id, facilitiesTeam)).toThrow();

    const { purchaseOrder } = store.selectVendor(quote.id, softwareTeam);
    expect(purchaseOrder.ownerTeam).toBe('software_team');

    // The PO is raised for finance approval first.
    expect(purchaseOrder.status).toBe('pending_finance');
    // Procurement cannot approve its own PO, and cannot issue it before finance clears it.
    expect(() => store.processPurchaseOrder(purchaseOrder.id, 'finance_approved', softwareTeam)).toThrow();
    expect(() => store.issuePurchaseOrderToSupplier(purchaseOrder.id, softwareTeam)).toThrow();

    // Finance approves -> it goes back to procurement.
    store.reviewPurchaseOrder(purchaseOrder.id, { approve: true, comments: 'within budget', user: finance });
    expect(store.getPurchaseOrder(purchaseOrder.id).status).toBe('finance_approved');

    // Only the designated team / central procurement issues it to the supplier.
    expect(() => store.issuePurchaseOrderToSupplier(purchaseOrder.id, facilitiesTeam)).toThrow();
    store.issuePurchaseOrderToSupplier(purchaseOrder.id, softwareTeam, 'Issued to supplier');
    expect(store.getPurchaseOrder(purchaseOrder.id).status).toBe('sent');

    expect(() => store.processPurchaseOrder(purchaseOrder.id, 'accepted', facilitiesTeam)).toThrow();
    expect(() => store.processPurchaseOrder(purchaseOrder.id, 'delivered', softwareTeam)).toThrow();

    store.processPurchaseOrder(purchaseOrder.id, 'accepted', softwareTeam, 'Supplier acknowledged');
    store.processPurchaseOrder(purchaseOrder.id, 'in_transit', softwareTeam);
    store.processPurchaseOrder(purchaseOrder.id, 'delivered', softwareTeam);
    store.processPurchaseOrder(purchaseOrder.id, 'closed', softwareTeam);
    expect(store.getPurchaseOrder(purchaseOrder.id).status).toBe('closed');
    expect(store.getRequest(req.id).status).toBe('closed');

    const trail = store.getRequestAuditTrail(req.id).map((a) => a.action);
    ['CREATE_REQUEST', 'SUBMIT_REQUEST', 'RETURN_REQUEST', 'UPDATE_REQUEST', 'RESUBMIT_REQUEST', 'APPROVE_REQUEST', 'CREATE_RFQ', 'SUBMIT_QUOTATION', 'APPROVE_QUOTATION', 'SELECT_VENDOR', 'CREATE_PO', 'PROCESS_PO'].forEach((action) => {
      expect(trail).toContain(action);
    });
  });

  it('lets an admin assign a role that the user then works under', () => {
    const admin = { id: 'U012', name: 'Admin User', role: 'admin' };
    const created = store.registerUser({
      name: 'New Joiner', email: `new.joiner.${Date.now()}@eps.com`, password: 'secret1', department: 'IT', role: 'employee',
    });
    expect(created.role).toBe('employee');

    // Only an admin may reassign roles.
    expect(() => store.assignRole(created.id, 'finance_officer', { id: 'U001', role: 'employee' })).toThrow();

    const updated = store.assignRole(created.id, 'finance_officer', admin);
    expect(updated.role).toBe('finance_officer');
    expect(store.getUser(created.id).role).toBe('finance_officer');
    expect(store.getAuditTrail(created.id).map((a) => a.action)).toContain('ASSIGN_ROLE');
    expect(store.getUserNotifications(created.id).some((n) => n.type === 'role_assigned')).toBe(true);
  });

  it('signs a user up with the role they selected', () => {
    const user = store.registerUser({
      name: 'Self Signup', email: `self.${Date.now()}@eps.com`, password: 'secret1', department: 'Facilities', role: 'facilities_team',
    });
    expect(user.role).toBe('facilities_team');
  });

  it('routes categories to their designated teams', () => {
    expect(canProcessCategory('facilities_team', 'Facilities')).toBe(true);
    expect(canProcessCategory('facilities_team', 'Equipment & Assets')).toBe(false);
    expect(canProcessCategory('procurement_officer', 'Facilities')).toBe(true);
  });
});

describe('finance payment processing', () => {
  const finance2 = { id: 'U010', name: 'Lakshmi Iyer', role: 'finance_officer' };
  const employee2 = { id: 'U001', name: 'Ravi Kumar', role: 'employee' };

  it('raises a payment when a PO is delivered, then verifies, releases and settles it', () => {
    const admin = { id: 'U012', name: 'Admin User', role: 'admin' };
    const existing = store.getPayments({ status: 'all' }).map((p) => p.poNumber);
    const po = store.getPurchaseOrdersForUser(admin).find((p) => !existing.includes(p.id));
    expect(po).toBeTruthy();
    const payment = store.ensurePaymentForPo(po, finance2);
    expect(payment.status).toBe('pending');
    // Idempotent — delivering twice must not duplicate the payable.
    expect(store.ensurePaymentForPo(po, finance2).id).toBe(payment.id);

    // Only finance can act on payments.
    expect(() => store.verifyInvoice(payment.id, { checks: {}, user: employee2 })).toThrow();

    // An incomplete three-way match is rejected and audited.
    expect(() => store.verifyInvoice(payment.id, {
      checks: { poVerified: true, grnVerified: true }, user: finance2,
    })).toThrow();
    expect(store.getAuditTrail(payment.id).map((a) => a.action)).toContain('VERIFY_INVOICE_REJECTED');

    // Cannot release before verification.
    expect(() => store.releasePayment(payment.id, { paymentMethod: 'NEFT', user: finance2 })).toThrow();

    const checks = { poVerified: true, grnVerified: true, invoiceVerified: true, taxVerified: true, amountVerified: true };
    expect(store.verifyInvoice(payment.id, { checks, remarks: 'matched', user: finance2 }).status).toBe('verified');

    const released = store.releasePayment(payment.id, { paymentMethod: 'RTGS', user: finance2 });
    expect(released.status).toBe('processing');
    expect(released.referenceNumber).toBeTruthy();

    const settled = store.confirmPayment(payment.id, { transactionId: 'TXN-TEST-1', user: finance2 });
    expect(settled.status).toBe('paid');
    expect(settled.paidDate).toBeTruthy();

    // No transitions remain, and the supplier was notified.
    expect(store.availablePaymentActions(settled, finance2)).toHaveLength(0);
    const actions = store.getAuditTrail(payment.id).map((a) => a.action);
    ['CREATE_PAYMENT', 'VERIFY_INVOICE', 'RELEASE_PAYMENT', 'COMPLETE_PAYMENT'].forEach((a) => expect(actions).toContain(a));
  });

  it('supports holding and reopening a payment', () => {
    const pending = store.getPayments({ status: 'pending' })[0];
    expect(store.updatePaymentStatus(pending.id, 'on_hold', { remarks: 'awaiting GRN', user: finance2 }).status).toBe('on_hold');
    expect(() => store.updatePaymentStatus(pending.id, 'paid', { user: finance2 })).toThrow();
    expect(store.updatePaymentStatus(pending.id, 'pending', { user: finance2 }).status).toBe('pending');
  });
});
