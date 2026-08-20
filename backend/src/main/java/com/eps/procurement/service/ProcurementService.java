package com.eps.procurement.service;

import com.eps.procurement.model.*;
import com.eps.procurement.policy.ProcurementPolicy;
import com.eps.procurement.store.DataStore;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Suppliers, purchase orders, quotations, GRNs and software licences. */
@Service
public class ProcurementService {

    private final DataStore store;
    private final NotificationService notifications;
    private final AuditService audit;
    private final FinanceService finance;

    public ProcurementService(DataStore store, NotificationService notifications, AuditService audit, FinanceService finance) {
        this.finance = finance;
        this.store = store;
        this.notifications = notifications;
        this.audit = audit;
    }

    private ProcurementRequest requestById(String id) {
        return store.requests.stream().filter(r -> r.id.equals(id)).findFirst().orElse(null);
    }

    // ── Department scoping ────────────────────────────────────
    private User actor(String actorId) {
        return audit.userById(actorId);
    }

    /**
     * Central procurement (procurement_officer / admin) may act on every category;
     * a department team (equipment_team, software_team, facilities_team) may only act
     * on the categories it is designated for. Unknown actors are treated as central
     * procurement so existing integrations keep working.
     */
    private void assertCanProcessCategory(String actorId, String category, String action) {
        User user = actor(actorId);
        if (user == null || user.role == null) {
            return;
        }
        if (!ProcurementPolicy.canProcessCategory(user.role, category)) {
            audit.record(user, action + "_denied", AuditService.ENTITY_REQUEST, null, category, null,
                    ProcurementPolicy.categoryDenialReason(user.role, category));
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    ProcurementPolicy.categoryDenialReason(user.role, category));
        }
    }

    // ── Suppliers ─────────────────────────────────────────────
    public Map<String, Object> searchSuppliers(String status, String search) {
        List<Supplier> list = store.suppliers.stream()
                .filter(s -> status == null || status.isBlank() || s.status.equals(status))
                .filter(s -> search == null || search.isBlank()
                        || s.companyName.toLowerCase().contains(search.toLowerCase()))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        body.put("totalPages", 1);
        return body;
    }

    public Supplier supplierById(String id) {
        return store.suppliers.stream().filter(s -> s.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supplier not found"));
    }

    public Supplier createSupplier(Supplier payload) {
        payload.id = DataStore.nextId("S", store.suppliers.size(), 3);
        payload.status = "draft";
        payload.rating = 0;
        payload.totalOrders = 0;
        payload.createdAt = LocalDate.now().toString();
        store.suppliers.add(payload);
        return payload;
    }

    public Supplier updateSupplier(String id, Supplier payload) {
        Supplier existing = supplierById(id);
        if (payload.companyName != null) existing.companyName = payload.companyName;
        if (payload.businessType != null) existing.businessType = payload.businessType;
        if (payload.gstNumber != null) existing.gstNumber = payload.gstNumber;
        if (payload.panNumber != null) existing.panNumber = payload.panNumber;
        if (payload.bankName != null) existing.bankName = payload.bankName;
        if (payload.accountNumber != null) existing.accountNumber = payload.accountNumber;
        if (payload.ifsc != null) existing.ifsc = payload.ifsc;
        if (payload.contactPerson != null) existing.contactPerson = payload.contactPerson;
        if (payload.phone != null) existing.phone = payload.phone;
        if (payload.email != null) existing.email = payload.email;
        if (payload.address != null) existing.address = payload.address;
        if (payload.status != null) existing.status = payload.status;
        return existing;
    }

    public Map<String, String> updateSupplierStatus(String id, String status) {
        Supplier supplier = supplierById(id);
        supplier.status = status;
        return Map.of("message", "Status updated", "newStatus", status);
    }

    // ── Purchase orders ───────────────────────────────────────
    public Map<String, Object> searchPurchaseOrders(String status, String supplierId) {
        List<PurchaseOrder> list = store.purchaseOrders.stream()
                .filter(po -> status == null || status.isBlank() || po.status.equals(status))
                .filter(po -> supplierId == null || supplierId.isBlank() || po.supplierId.equals(supplierId))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public PurchaseOrder purchaseOrderById(String id) {
        return store.purchaseOrders.stream().filter(po -> po.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Purchase order not found"));
    }

    public PurchaseOrder createPurchaseOrder(PurchaseOrder payload) {
        payload.id = DataStore.nextId("PO-2024-", store.purchaseOrders.size(), 3);
        if (payload.items == null) {
            payload.items = new ArrayList<>();
        }
        payload.items.forEach(item -> item.total = item.quantity * item.unitPrice);
        payload.subtotal = payload.items.stream().mapToDouble(item -> item.total).sum();
        payload.tax = Math.round(payload.subtotal * 0.18);
        payload.totalAmount = payload.subtotal + payload.tax;
        if (payload.status == null || payload.status.isBlank()) {
            payload.status = "draft";
        }
        payload.createdAt = LocalDate.now().toString();
        if (payload.supplierName == null && payload.supplierId != null) {
            payload.supplierName = supplierById(payload.supplierId).companyName;
        }
        ProcurementRequest linkedRequest = requestById(payload.requestId);
        if ((payload.category == null || payload.category.isBlank()) && linkedRequest != null) {
            payload.category = linkedRequest.category;
        }
        payload.ownerTeam = ProcurementPolicy.teamForCategory(payload.category);
        store.purchaseOrders.add(payload);

        // Move the linked request into the procurement stage.
        store.requests.stream()
                .filter(r -> r.id.equals(payload.requestId))
                .findFirst()
                .ifPresent(r -> {
                    r.status = "in_procurement";
                    if (r.procurementStage == null || !"po_created".equals(r.procurementStage)) {
                        r.procurementStage = "po_created";
                    }
                });
        return payload;
    }

    public Map<String, String> updatePurchaseOrderStatus(String id, String status) {
        PurchaseOrder po = purchaseOrderById(id);
        String from = po.status;
        po.status = status;
        audit.recordBy(null, "po_status_updated", AuditService.ENTITY_PURCHASE_ORDER, po.id, from, status,
                "Purchase order status set to " + status);
        return Map.of("message", "Status updated", "newStatus", status);
    }

    // ── Goods receipt notes ───────────────────────────────────
    public Map<String, Object> searchGrns(String poNumber, String status) {
        List<GoodsReceiptNote> list = store.goodsReceiptNotes.stream()
                .filter(g -> poNumber == null || poNumber.isBlank() || g.poNumber.equals(poNumber))
                .filter(g -> status == null || status.isBlank() || g.status.equals(status))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public GoodsReceiptNote createGrn(GoodsReceiptNote payload) {
        payload.id = DataStore.nextId("GRN-2024-", store.goodsReceiptNotes.size(), 3);
        payload.receivedDate = LocalDate.now().toString();
        payload.status = "pending";
        payload.handoverConfirmed = false;
        if (payload.items == null) {
            payload.items = new ArrayList<>();
        }
        store.goodsReceiptNotes.add(payload);
        return payload;
    }

    public GoodsReceiptNote confirmHandover(String id) {
        GoodsReceiptNote grn = store.goodsReceiptNotes.stream().filter(g -> g.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "GRN not found"));
        grn.handoverConfirmed = true;
        grn.status = "completed";
        return grn;
    }

    // ── Quotations & licences ─────────────────────────────────
    public List<Quotation> quotations(String requestId) {
        return store.quotations.stream()
                .filter(q -> requestId == null || requestId.isBlank() || q.requestId.equals(requestId))
                .toList();
    }

    public List<SoftwareLicense> licenses() {
        return store.softwareLicenses;
    }

    // ── RFQs ──────────────────────────────────────────────────
    public Map<String, Object> searchRfqs(String supplierId, String status, String requestId) {
        List<Rfq> list = store.rfqs.stream()
                .filter(r -> supplierId == null || supplierId.isBlank() || supplierId.equalsIgnoreCase(r.supplierId))
                .filter(r -> status == null || status.isBlank() || status.equalsIgnoreCase(r.status))
                .filter(r -> requestId == null || requestId.isBlank() || requestId.equalsIgnoreCase(r.requestId))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public Rfq rfqById(String id) {
        return store.rfqs.stream().filter(r -> r.id.equalsIgnoreCase(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RFQ not found"));
    }

    public Rfq createRfq(Rfq payload) {
        return createRfq(payload, null);
    }

    public Rfq createRfq(Rfq payload, String actorId) {
        ProcurementRequest linked = requestById(payload.requestId);
        String category = payload.category != null && !payload.category.isBlank()
                ? payload.category
                : (linked != null ? linked.category : null);
        assertCanProcessCategory(actorId, category, "rfq_create");
        if (linked != null && payload.itemName != null) {
            String violation = ProcurementPolicy.validateItemCategory(payload.itemName,
                    category, linked.subcategory);
            if (violation != null) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, violation);
            }
        }
        payload.id = DataStore.nextId("RFQ-2024-", store.rfqs.size(), 3);
        payload.rfqNumber = payload.id;
        if (payload.productAvailability == null) payload.productAvailability = "Pending Check";
        payload.status = "pending";
        payload.createdAt = LocalDate.now().toString();
        if (payload.supplierName == null && payload.supplierId != null) {
            payload.supplierName = supplierById(payload.supplierId).companyName;
        }
        store.rfqs.add(payload);

        ProcurementRequest request = requestById(payload.requestId);
        if (request != null) {
            request.procurementStage = "rfq_pending";
        }
        audit.recordBy(actorId, "rfq_created", AuditService.ENTITY_RFQ, payload.id, null, "pending",
                "RFQ for " + payload.itemName + " sent to " + payload.supplierName
                        + " (" + payload.requestId + ")");
        notifications.pushToSupplier(payload.supplierId, "rfq_received", "New RFQ Received",
                payload.rfqNumber + " for " + payload.itemName + " (qty " + payload.quantity
                        + "). Please submit your quotation before " + payload.submissionDeadline + ".",
                "/supplier-portal");
        return payload;
    }

    public Rfq updateRfqAvailability(String id, String availability) {
        Rfq rfq = rfqById(id);
        rfq.productAvailability = availability;
        return rfq;
    }

    public Rfq declineRfq(String id, String reason, String remarks) {
        Rfq rfq = rfqById(id);
        rfq.status = "declined";
        rfq.productAvailability = "Out of Stock";
        rfq.declineReason = reason;
        rfq.declineRemarks = remarks;
        return rfq;
    }

    // ── Supplier Quotation Submission ─────────────────────────
    public Quotation submitQuotation(Quotation payload) {
        payload.id = DataStore.nextId("Q", store.quotations.size(), 3);
        payload.status = "pending";
        payload.submittedAt = LocalDate.now().toString();

        if (payload.totalAmount <= 0 && payload.unitPrice > 0) {
            int qty = 1;
            if (payload.items != null && !payload.items.isEmpty()) {
                qty = payload.items.get(0).quantity;
            }
            payload.totalAmount = payload.unitPrice * qty;
        }

        payload.financeStatus = "pending_finance";
        payload.selected = false;

        if (payload.supplierName == null && payload.supplierId != null) {
            payload.supplierName = supplierById(payload.supplierId).companyName;
        }

        store.quotations.add(payload);

        if (payload.rfqId != null) {
            store.rfqs.stream()
                    .filter(r -> r.id.equalsIgnoreCase(payload.rfqId))
                    .findFirst()
                    .ifPresent(r -> {
                        r.status = "quoted";
                        if (payload.requestId == null) {
                            payload.requestId = r.requestId;
                        }
                    });
        }

        ProcurementRequest request = requestById(payload.requestId);
        if (request != null) {
            request.procurementStage = "finance_review";
        }

        audit.recordBy(payload.supplierId, "quotation_submitted", AuditService.ENTITY_QUOTATION, payload.id,
                null, "pending_finance",
                payload.supplierName + " quoted Rs " + Math.round(payload.totalAmount)
                        + " for " + payload.requestId);

        String label = payload.requestId + " - " + payload.supplierName;
        notifications.pushToRoles(List.of("finance_officer"), "quotation_submitted",
                "Quotation Awaiting Finance Approval",
                label + " submitted a quotation of Rs " + Math.round(payload.totalAmount)
                        + ". Please review and approve it.",
                "/finance/quotations");
        notifications.pushToRoles(List.of("procurement_officer"), "quotation_submitted",
                "New Quotation Received",
                label + " submitted a quotation of Rs " + Math.round(payload.totalAmount) + ".",
                "/procurement/vendor-selection/" + payload.requestId);
        return payload;
    }

    // ── Quotations: finance approval & vendor selection ────────
    public Quotation quotationById(String id) {
        return store.quotations.stream().filter(q -> q.id.equalsIgnoreCase(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quotation not found"));
    }

    public Map<String, Object> searchQuotations(String requestId, String financeStatus, String supplierId) {
        List<Quotation> list = store.quotations.stream()
                .filter(q -> requestId == null || requestId.isBlank() || requestId.equalsIgnoreCase(q.requestId))
                .filter(q -> supplierId == null || supplierId.isBlank() || supplierId.equalsIgnoreCase(q.supplierId))
                .filter(q -> financeStatus == null || financeStatus.isBlank()
                        || financeStatus.equalsIgnoreCase(q.financeStatus))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    /** Finance officer approves or rejects a supplier quotation. */
    public Quotation reviewQuotation(String id, boolean approve, String comments, String reviewedBy) {
        Quotation quotation = quotationById(id);
        if (!"pending_finance".equalsIgnoreCase(quotation.financeStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Quotation has already been reviewed by finance (" + quotation.financeStatus + ")");
        }
        String previousFinanceStatus = quotation.financeStatus;
        quotation.financeStatus = approve ? "approved" : "rejected";
        quotation.status = approve ? "finance_approved" : "rejected";
        quotation.financeComments = comments == null ? "" : comments;
        quotation.financeReviewedBy = reviewedBy == null ? "Finance Officer" : reviewedBy;
        quotation.financeReviewedAt = LocalDate.now().toString();

        ProcurementRequest request = requestById(quotation.requestId);
        if (request != null && approve) {
            request.procurementStage = "quotations_received";
        }

        audit.recordBy(reviewedBy, approve ? "quotation_finance_approved" : "quotation_finance_rejected",
                AuditService.ENTITY_QUOTATION, quotation.id, previousFinanceStatus, quotation.financeStatus,
                comments == null || comments.isBlank() ? "Finance review completed" : comments);

        notifications.pushToRoles(List.of("procurement_officer"),
                approve ? "quotation_approved" : "quotation_rejected",
                approve ? "Quotation Approved by Finance" : "Quotation Rejected by Finance",
                quotation.id + " from " + quotation.supplierName + " for " + quotation.requestId
                        + (approve ? " is approved. You can now select the vendor." : " was rejected by finance."),
                approve ? "/procurement/vendor-selection/" + quotation.requestId : "/procurement");
        notifications.pushToSupplier(quotation.supplierId,
                approve ? "quotation_approved" : "quotation_rejected",
                approve ? "Quotation Cleared" : "Quotation Rejected",
                "Your quotation " + quotation.id + " was " + (approve ? "approved" : "rejected")
                        + " during finance review.",
                "/supplier-portal");
        return quotation;
    }

    /**
     * Procurement officer selects the winning vendor. Only finance-approved quotations
     * are eligible; the matching purchase order is raised automatically.
     */
    public Map<String, Object> selectVendor(String quotationId, String selectedBy, String deliveryDate) {
        Quotation winner = quotationById(quotationId);
        if (!"approved".equalsIgnoreCase(winner.financeStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only finance-approved quotations can be awarded");
        }
        ProcurementRequest request = requestById(winner.requestId);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked request not found");
        }
        if (request.selectedQuotationId != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "A vendor has already been selected for " + request.id);
        }
        assertCanProcessCategory(selectedBy, request.category, "vendor_select");
        String categoryViolation = ProcurementPolicy.validateItemCategory(request.title,
                request.category, request.subcategory);
        if (categoryViolation != null) {
            audit.recordBy(selectedBy, "vendor_select_rejected", AuditService.ENTITY_REQUEST, request.id,
                    request.category + " -> " + request.subcategory, null, categoryViolation);
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, categoryViolation);
        }

        winner.selected = true;
        winner.status = "accepted";
        store.quotations.stream()
                .filter(q -> winner.requestId != null && winner.requestId.equalsIgnoreCase(q.requestId))
                .filter(q -> !q.id.equals(winner.id))
                .forEach(q -> {
                    q.selected = false;
                    if (!"rejected".equalsIgnoreCase(q.status)) {
                        q.status = "not_selected";
                    }
                    notifications.pushToSupplier(q.supplierId, "quotation_rejected", "Quotation Not Selected",
                            "Your quotation " + q.id + " for " + q.requestId + " was not selected.",
                            "/supplier-portal");
                });

        PurchaseOrder po = new PurchaseOrder();
        po.requestId = request.id;
        po.supplierId = winner.supplierId;
        po.supplierName = winner.supplierName;
        po.items = new ArrayList<>();
        if (winner.items != null) {
            winner.items.forEach(i -> po.items.add(
                    new PurchaseOrderItem(i.name, i.quantity, i.unitPrice, i.unitPrice * i.quantity)));
        }
        if (po.items.isEmpty()) {
            int qty = request.quantity > 0 ? request.quantity : 1;
            double unit = winner.unitPrice > 0 ? winner.unitPrice : winner.totalAmount / qty;
            po.items.add(new PurchaseOrderItem(request.title, qty, unit, unit * qty));
        }
        po.deliveryDate = deliveryDate != null && !deliveryDate.isBlank() ? deliveryDate : request.requiredDate;
        po.status = "sent";
        po.createdBy = selectedBy;
        po.category = request.category;
        po.ownerTeam = ProcurementPolicy.teamForCategory(request.category);
        PurchaseOrder created = createPurchaseOrder(po);

        request.selectedQuotationId = winner.id;
        request.selectedSupplierId = winner.supplierId;
        request.selectedSupplierName = winner.supplierName;
        request.poId = created.id;
        request.procurementStage = "po_created";
        request.status = "in_procurement";

        audit.recordBy(selectedBy, "vendor_selected", AuditService.ENTITY_VENDOR_AWARD, request.id,
                null, winner.supplierName,
                winner.supplierName + " awarded " + request.id + " at Rs " + Math.round(winner.totalAmount)
                        + " (quotation " + winner.id + ")");
        audit.recordBy(selectedBy, "po_created", AuditService.ENTITY_PURCHASE_ORDER, created.id,
                null, created.status, created.id + " raised for " + request.id + " to " + winner.supplierName);

        notifications.pushToSupplier(winner.supplierId, "po_created", "Purchase Order Awarded",
                created.id + " has been issued to you for " + request.title + ".",
                "/supplier-portal");
        notifications.push(request.createdBy, "po_created", "Vendor Selected",
                winner.supplierName + " was selected for " + request.id + ". " + created.id + " has been raised.",
                "/requests/" + request.id);
        notifications.pushToRoles(List.of("finance_officer"), "po_created", "Purchase Order Raised",
                created.id + " for " + request.id + " (Rs " + Math.round(created.totalAmount) + ") was issued to "
                        + winner.supplierName + ".",
                "/purchase-orders/" + created.id);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Vendor selected and purchase order created");
        body.put("quotation", winner);
        body.put("purchaseOrder", created);
        body.put("request", request);
        return body;
    }

    // ── Department-scoped purchase order processing ───────────
    /** Statuses a purchase order may legally move to from its current state. */
    public Map<String, Object> purchaseOrderTransitions(String id) {
        PurchaseOrder po = purchaseOrderById(id);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", po.status);
        body.put("ownerTeam", poCategory(po) == null ? null : ProcurementPolicy.teamForCategory(poCategory(po)));
        body.put("next", ProcurementPolicy.nextPoStatuses(po.status));
        return body;
    }

    private String poCategory(PurchaseOrder po) {
        if (po.category != null && !po.category.isBlank()) {
            return po.category;
        }
        ProcurementRequest request = requestById(po.requestId);
        return request == null ? null : request.category;
    }

    /**
     * Moves a purchase order through the state machine
     * (draft → sent → accepted → in_transit → delivered → closed).
     * Only the designated department team for the PO category, or central
     * procurement, may process it. Every transition is audited.
     */
    public Map<String, Object> processPurchaseOrder(String id, String toStatus, String actorId, String remarks) {
        PurchaseOrder po = purchaseOrderById(id);
        String category = poCategory(po);
        assertCanProcessCategory(actorId, category, "po_process");

        String target = toStatus == null ? "" : toStatus.trim().toLowerCase();
        String from = po.status == null ? "draft" : po.status.toLowerCase();
        if (!ProcurementPolicy.canTransitionPo(from, target)) {
            audit.recordBy(actorId, "po_transition_rejected", AuditService.ENTITY_PURCHASE_ORDER, po.id,
                    from, target, "Illegal purchase order transition");
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot move " + po.id + " from " + from + " to " + target
                            + ". Allowed: " + ProcurementPolicy.nextPoStatuses(from));
        }

        User user = actor(actorId);
        po.status = target;
        po.category = category;
        po.ownerTeam = ProcurementPolicy.teamForCategory(category);
        po.processedBy = user == null ? actorId : user.name;
        po.processedByRole = user == null ? null : user.role;
        po.processedAt = LocalDate.now().toString();
        po.processingRemarks = remarks;

        ProcurementRequest request = requestById(po.requestId);
        if (request != null) {
            switch (target) {
                case "sent" -> request.procurementStage = "po_created";
                case "accepted" -> request.procurementStage = "po_accepted";
                case "in_transit" -> request.procurementStage = "in_transit";
                case "delivered" -> {
                    request.procurementStage = "delivered";
                    request.status = "delivered";
                }
                case "closed" -> {
                    request.procurementStage = "closed";
                    request.status = "completed";
                }
                case "cancelled" -> request.status = "cancelled";
                default -> { }
            }
            audit.recordBy(actorId, "request_stage_updated", AuditService.ENTITY_REQUEST, request.id,
                    from, target, "Purchase order " + po.id + " moved to " + target);
        }

        if ("delivered".equals(target)) {
            // Delivery makes the invoice payable: raise it for finance.
            finance.ensurePaymentForPo(po, actorId);
        }

        audit.recordBy(actorId, "po_" + target, AuditService.ENTITY_PURCHASE_ORDER, po.id, from, target,
                remarks == null || remarks.isBlank() ? "Purchase order moved to " + target : remarks);

        notifications.pushToSupplier(po.supplierId, "po_" + target, "Purchase Order " + po.id + " updated",
                po.id + " is now " + target.replace('_', ' ') + ".", "/supplier-portal");
        if (request != null) {
            notifications.push(request.createdBy, "po_" + target, "Order Update",
                    po.id + " for " + request.id + " is now " + target.replace('_', ' ') + ".",
                    "/purchase-orders/" + po.id);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Purchase order moved to " + target);
        body.put("purchaseOrder", po);
        body.put("next", ProcurementPolicy.nextPoStatuses(target));
        body.put("auditTrail", audit.trail(AuditService.ENTITY_PURCHASE_ORDER, po.id));
        return body;
    }

    /** Purchase orders a department team is allowed to work on. */
    public Map<String, Object> purchaseOrdersForActor(String actorId, String status) {
        User user = actor(actorId);
        List<PurchaseOrder> list = store.purchaseOrders.stream()
                .filter(po -> status == null || status.isBlank() || status.equalsIgnoreCase(po.status))
                .filter(po -> user == null || user.role == null
                        || ProcurementPolicy.canProcessCategory(user.role, poCategory(po)))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    // ── Supplier Purchase Order Actions ───────────────────────
    public PurchaseOrder acceptPurchaseOrder(String id) {
        PurchaseOrder po = purchaseOrderById(id);
        String from = po.status;
        po.status = "accepted";
        audit.recordBy(po.supplierId, "po_accepted", AuditService.ENTITY_PURCHASE_ORDER, po.id, from,
                "accepted", "Supplier acknowledged " + po.id);
        return po;
    }

    public PurchaseOrder rejectPurchaseOrder(String id, String reason) {
        PurchaseOrder po = purchaseOrderById(id);
        String from = po.status;
        po.status = "rejected";
        po.reclineReason = reason;
        audit.recordBy(po.supplierId, "po_rejected", AuditService.ENTITY_PURCHASE_ORDER, po.id, from,
                "rejected", reason == null ? "Supplier rejected the purchase order" : reason);
        return po;
    }

    public PurchaseOrder uploadInvoice(String id, String invoiceNumber, double invoiceAmount, String fileName) {
        PurchaseOrder po = purchaseOrderById(id);
        po.invoiceNumber = invoiceNumber;
        po.invoiceAmount = invoiceAmount > 0 ? invoiceAmount : po.totalAmount;
        po.invoiceFileName = fileName != null ? fileName : "invoice_" + id + ".pdf";
        po.invoiceUploadedAt = LocalDate.now().toString();
        return po;
    }

    // ── Supplier Portal Stats ──────────────────────────────────
    public Map<String, Object> getSupplierPortalStats(String supplierId) {
        long pendingRfqs = store.rfqs.stream()
                .filter(r -> r.supplierId.equalsIgnoreCase(supplierId) && "pending".equalsIgnoreCase(r.status))
                .count();
        long submittedQuotations = store.quotations.stream()
                .filter(q -> q.supplierId.equalsIgnoreCase(supplierId))
                .count();
        long posReceived = store.purchaseOrders.stream()
                .filter(po -> po.supplierId.equalsIgnoreCase(supplierId))
                .count();
        long activeOrders = store.purchaseOrders.stream()
                .filter(po -> po.supplierId.equalsIgnoreCase(supplierId) &&
                        ("accepted".equalsIgnoreCase(po.status) || "processing".equalsIgnoreCase(po.status) ||
                         "packed".equalsIgnoreCase(po.status) || "shipped".equalsIgnoreCase(po.status)))
                .count();
        long completedOrders = store.purchaseOrders.stream()
                .filter(po -> po.supplierId.equalsIgnoreCase(supplierId) &&
                        ("delivered".equalsIgnoreCase(po.status) || "closed".equalsIgnoreCase(po.status)))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("pendingRfqs", pendingRfqs);
        stats.put("submittedQuotations", submittedQuotations);
        stats.put("purchaseOrdersReceived", posReceived);
        stats.put("activeOrders", activeOrders);
        stats.put("completedOrders", completedOrders);
        return stats;
    }
}
