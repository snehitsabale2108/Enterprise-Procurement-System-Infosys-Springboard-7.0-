package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A supplier quotation submitted against a request. */
public class Quotation {
    public String id;
    public String requestId;
    public String supplierId;
    public String supplierName;
    public List<QuotationItem> items = new ArrayList<>();
    public double totalAmount;
    public String validUntil;
    public String status;
    public String submittedAt;

    public Quotation() {}

    public Quotation(String id, String requestId, String supplierId, String supplierName,
                     List<QuotationItem> items, double totalAmount, String validUntil,
                     String status, String submittedAt) {
        this.id = id;
        this.requestId = requestId;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.items = items;
        this.totalAmount = totalAmount;
        this.validUntil = validUntil;
        this.status = status;
        this.submittedAt = submittedAt;
    }
}
