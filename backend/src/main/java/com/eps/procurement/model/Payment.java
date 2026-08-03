package com.eps.procurement.model;

/** A supplier payment against a purchase order. */
public class Payment {
    public String id;
    public String poNumber;
    public String supplierName;
    public double amount;
    public String paymentMethod;
    public String referenceNumber;
    public String status;
    public String paidDate;
    public String verifiedBy;
    public String transactionId;

    public Payment() {}

    public Payment(String id, String poNumber, String supplierName, double amount, String paymentMethod,
                   String referenceNumber, String status, String paidDate, String verifiedBy,
                   String transactionId) {
        this.id = id;
        this.poNumber = poNumber;
        this.supplierName = supplierName;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.referenceNumber = referenceNumber;
        this.status = status;
        this.paidDate = paidDate;
        this.verifiedBy = verifiedBy;
        this.transactionId = transactionId;
    }
}
