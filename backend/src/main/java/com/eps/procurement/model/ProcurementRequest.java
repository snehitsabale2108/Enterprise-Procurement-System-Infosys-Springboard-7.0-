package com.eps.procurement.model;

/** A procurement request raised by an employee. */
public class ProcurementRequest {
    public String id;
    public String title;
    public String description;
    public String reason;
    public String category;
    public String subcategory;
    public int quantity;
    public double estimatedCost;
    public String department;
    public String requiredDate;
    public String status;
    public String createdBy;
    public String createdAt;
    public String updatedAt;
    public String priority;

    // ── Return-for-correction trail (draft becomes editable again) ──
    public String returnComments;
    public String returnedBy;
    public String returnedByRole;
    public String returnedAt;
    public String returnedFromStatus;

    // ── Procurement stage tracking ──
    public String procurementStage;   // "rfq_pending"|"quotations_received"|"finance_review"|"vendor_selected"|"po_created"
    public String selectedQuotationId;
    public String selectedSupplierId;
    public String selectedSupplierName;
    public String poId;

    public ProcurementRequest() {}

    public ProcurementRequest(String id, String title, String description, String reason, String category,
                              String subcategory, int quantity, double estimatedCost, String department,
                              String requiredDate, String status, String createdBy, String createdAt,
                              String updatedAt, String priority) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.reason = reason;
        this.category = category;
        this.subcategory = subcategory;
        this.quantity = quantity;
        this.estimatedCost = estimatedCost;
        this.department = department;
        this.requiredDate = requiredDate;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.priority = priority;
    }
}
