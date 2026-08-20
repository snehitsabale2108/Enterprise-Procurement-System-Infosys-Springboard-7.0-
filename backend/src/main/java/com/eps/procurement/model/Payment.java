package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A supplier payment against a purchase order.
 *
 * <p>Lifecycle: {@code pending → verified → processing → paid}, with
 * {@code on_hold} and {@code failed} as recoverable side states. The three-way
 * match result is kept in {@link #checks} and every transition is appended to
 * {@link #history} so the finance trail is reproducible.
 */
public class Payment {
    public String id;
    public String poId;
    public String poNumber;
    public String requestId;
    public String supplierId;
    public String supplierName;
    public String invoiceNumber;
    public double amount;
    public String paymentMethod;
    public String referenceNumber;
    public String status;
    public String paidDate;
    public String verifiedBy;
    public String verifiedByName;
    public String verifiedAt;
    public String releasedBy;
    public String releasedAt;
    public String transactionId;
    public String remarks;
    public String createdAt;
    public Map<String, Boolean> checks;
    public List<Map<String, Object>> history = new ArrayList<>();

    public Payment() {}

    public Payment(String id, String poNumber, String supplierName, double amount, String paymentMethod,
                   String referenceNumber, String status, String paidDate, String verifiedBy,
                   String transactionId) {
        this.id = id;
        this.poId = poNumber;
        this.poNumber = poNumber;
        this.supplierName = supplierName;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.status = status;
        this.paidDate = paidDate;
        this.verifiedBy = verifiedBy;
        this.transactionId = transactionId;
        this.invoiceNumber = id == null ? null : "INV-" + id.substring(id.lastIndexOf('-') + 1);
    }

    /** Appends a history entry describing one transition. */
    public void addHistory(String status, String by, String role, String at, String remarks) {
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("status", status);
        entry.put("by", by);
        entry.put("role", role);
        entry.put("at", at);
        entry.put("remarks", remarks == null ? "" : remarks);
        this.history.add(entry);
    }
}
