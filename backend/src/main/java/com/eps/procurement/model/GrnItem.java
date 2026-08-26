package com.eps.procurement.model;

/** A goods-receipt line item with its quality-check outcome. */
public class GrnItem {
    public String name;
    public int orderedQty;
    public int receivedQty;
    public String qualityCheck;

    public GrnItem() {}

    public GrnItem(String name, int orderedQty, int receivedQty, String qualityCheck) {
        this.name = name;
        this.orderedQty = orderedQty;
        this.receivedQty = receivedQty;
        this.qualityCheck = qualityCheck;
    }
}
