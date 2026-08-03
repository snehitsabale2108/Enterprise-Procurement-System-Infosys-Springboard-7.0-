package com.eps.procurement.model;

import java.util.ArrayList;
import java.util.List;

/** A purchased software licence and its seat usage. */
public class SoftwareLicense {
    public String id;
    public String name;
    public String vendor;
    public String licenseKey;
    public int totalSeats;
    public int usedSeats;
    public String expiryDate;
    public String status;
    public double annualCost;
    public List<String> assignedTo = new ArrayList<>();

    public SoftwareLicense() {}

    public SoftwareLicense(String id, String name, String vendor, String licenseKey, int totalSeats,
                           int usedSeats, String expiryDate, String status, double annualCost,
                           List<String> assignedTo) {
        this.id = id;
        this.name = name;
        this.vendor = vendor;
        this.licenseKey = licenseKey;
        this.totalSeats = totalSeats;
        this.usedSeats = usedSeats;
        this.expiryDate = expiryDate;
        this.status = status;
        this.annualCost = annualCost;
        this.assignedTo = assignedTo;
    }
}
