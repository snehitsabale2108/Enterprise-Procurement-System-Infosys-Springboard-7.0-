package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A supplier quotation submitted against a request. */
public class Quotation {
    public String id;
    public String rfqId;
    public String requestId;
    public String supplierId;
    public String supplierName;
    public double unitPrice;
    public List<QuotationItem> items = new ArrayList<>();
    public double totalAmount;
    public String estimatedDeliveryTime;
    public String warranty;
    public String remarks;
    public String validUntil;
    public String status;
    public String submittedAt;

    // ── Finance review of the quotation ──
    public String financeStatus = "pending_finance"; // "pending_finance"|"approved"|"rejected"
    public String financeComments;
    public String financeReviewedBy;
    public String financeReviewedAt;
    public boolean selected;

    public Quotation() {}

    public Quotation(String id, String rfqId, String requestId, String supplierId, String supplierName,
                     double unitPrice, List<QuotationItem> items, double totalAmount, String estimatedDeliveryTime,
                     String warranty, String remarks, String validUntil, String status, String submittedAt) {
        this.id = id;
        this.rfqId = rfqId;
        this.requestId = requestId;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.unitPrice = unitPrice;
        this.items = items;
        this.totalAmount = totalAmount;
        this.estimatedDeliveryTime = estimatedDeliveryTime;
        this.warranty = warranty;
        this.remarks = remarks;
        this.validUntil = validUntil;
        this.status = status;
        this.submittedAt = submittedAt;
        this.financeStatus = "accepted".equalsIgnoreCase(status) ? "approved"
                : "rejected".equalsIgnoreCase(status) ? "rejected" : "pending_finance";
        this.selected = "accepted".equalsIgnoreCase(status);
    }
}
