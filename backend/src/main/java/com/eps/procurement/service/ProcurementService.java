package com.eps.procurement.service;

import com.eps.procurement.model.*;
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

    public ProcurementService(DataStore store) {
        this.store = store;
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
        store.purchaseOrders.add(payload);

        // Move the linked request into the procurement stage.
        store.requests.stream()
                .filter(r -> r.id.equals(payload.requestId))
                .findFirst()
                .ifPresent(r -> r.status = "in_procurement");
        return payload;
    }

    public Map<String, String> updatePurchaseOrderStatus(String id, String status) {
        PurchaseOrder po = purchaseOrderById(id);
        po.status = status;
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
        payload.id = DataStore.nextId("RFQ-2024-", store.rfqs.size(), 3);
        payload.rfqNumber = payload.id;
        if (payload.productAvailability == null) payload.productAvailability = "Pending Check";
        payload.status = "pending";
        payload.createdAt = LocalDate.now().toString();
        store.rfqs.add(payload);
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

        store.quotations.add(payload);

        if (payload.rfqId != null) {
            store.rfqs.stream()
                    .filter(r -> r.id.equalsIgnoreCase(payload.rfqId))
                    .findFirst()
                    .ifPresent(r -> r.status = "quoted");
        }
        return payload;
    }

    // ── Supplier Purchase Order Actions ───────────────────────
    public PurchaseOrder acceptPurchaseOrder(String id) {
        PurchaseOrder po = purchaseOrderById(id);
        po.status = "accepted";
        return po;
    }

    public PurchaseOrder rejectPurchaseOrder(String id, String reason) {
        PurchaseOrder po = purchaseOrderById(id);
        po.status = "rejected";
        po.reclineReason = reason;
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
