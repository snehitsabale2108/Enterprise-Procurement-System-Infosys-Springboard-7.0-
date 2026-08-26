package com.eps.procurement.model;

/** Request For Quotation (RFQ) sent to a supplier. */
public class Rfq {
    public String id;
    public String rfqNumber;
    public String requestId;
    public String supplierId;
    public String supplierName;
    public String itemName;
    public int quantity;
    public String requiredDeliveryDate;
    public String deliveryLocation;
    public String submissionDeadline;
    public String category;
    public String productAvailability; // "Available", "Out of Stock", "Pending Check"
    public String status;              // "pending", "quoted", "declined"
    public String declineReason;
    public String declineRemarks;
    public String createdAt;

    public Rfq() {}

    public Rfq(String id, String rfqNumber, String requestId, String supplierId, String supplierName,
               String itemName, int quantity, String requiredDeliveryDate, String deliveryLocation,
               String submissionDeadline, String category, String productAvailability, String status,
               String declineReason, String declineRemarks, String createdAt) {
        this.id = id;
        this.rfqNumber = rfqNumber;
        this.requestId = requestId;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.itemName = itemName;
        this.quantity = quantity;
        this.requiredDeliveryDate = requiredDeliveryDate;
        this.deliveryLocation = deliveryLocation;
        this.submissionDeadline = submissionDeadline;
        this.category = category;
        this.productAvailability = productAvailability;
        this.status = status;
        this.declineReason = declineReason;
        this.declineRemarks = declineRemarks;
        this.createdAt = createdAt;
    }
}
