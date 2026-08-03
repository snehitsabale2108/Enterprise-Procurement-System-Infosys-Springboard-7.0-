package com.eps.procurement.model;

/** A single line item of a purchase order. */
public class PurchaseOrderItem {
    public String name;
    public int quantity;
    public double unitPrice;
    public double total;

    public PurchaseOrderItem() {}

    public PurchaseOrderItem(String name, int quantity, double unitPrice, double total) {
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
    }
}
