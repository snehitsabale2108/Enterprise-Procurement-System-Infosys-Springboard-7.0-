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
}
