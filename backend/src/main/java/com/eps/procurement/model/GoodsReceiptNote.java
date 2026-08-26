package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A goods receipt note (GRN) recorded when a delivery arrives. */
public class GoodsReceiptNote {
    public String id;
    public String poNumber;
    public List<GrnItem> items = new ArrayList<>();
    public String receivedDate;
    public String verifiedBy;
    public String handoverTo;
    public boolean handoverConfirmed;
    public String remarks;
    public String status;

    public GoodsReceiptNote() {}

    public GoodsReceiptNote(String id, String poNumber, List<GrnItem> items, String receivedDate,
                            String verifiedBy, String handoverTo, boolean handoverConfirmed,
                            String remarks, String status) {
        this.id = id;
        this.poNumber = poNumber;
        this.items = items;
        this.receivedDate = receivedDate;
        this.verifiedBy = verifiedBy;
        this.handoverTo = handoverTo;
        this.handoverConfirmed = handoverConfirmed;
        this.remarks = remarks;
        this.status = status;
    }
}
