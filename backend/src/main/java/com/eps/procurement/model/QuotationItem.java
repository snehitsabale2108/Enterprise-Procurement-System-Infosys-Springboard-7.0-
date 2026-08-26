package com.eps.procurement.model;

/** A quoted line item from a supplier. */
public class QuotationItem {
    public String name;
    public double unitPrice;
    public int quantity;

    public QuotationItem() {}

    public QuotationItem(String name, double unitPrice, int quantity) {
        this.name = name;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }
}
