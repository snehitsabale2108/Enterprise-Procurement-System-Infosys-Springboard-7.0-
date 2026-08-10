package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A purchase order issued to a supplier. */
public class PurchaseOrder {
    public String id;
    public String requestId;
    public String supplierId;
    public String supplierName;
    public List<PurchaseOrderItem> items = new ArrayList<>();
    public double subtotal;
    public double tax;
    public double totalAmount;
    public String deliveryDate;
    public String status;
    public String reclineReason;
    public String invoiceNumber;
    public double invoiceAmount;
    public String invoiceFileName;
    public String invoiceUploadedAt;
    public String createdAt;
    public String createdBy;

    public PurchaseOrder() {}

    public PurchaseOrder(String id, String requestId, String supplierId, String supplierName,
                         List<PurchaseOrderItem> items, double subtotal, double tax, double totalAmount,
                         String deliveryDate, String status, String createdAt, String createdBy) {
        this.id = id;
        this.requestId = requestId;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.items = items;
        this.subtotal = subtotal;
        this.tax = tax;
        this.totalAmount = totalAmount;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }
}
