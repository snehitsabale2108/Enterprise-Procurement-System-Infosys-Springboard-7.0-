package com.eps.procurement.model;

/** A registered supplier / vendor. */
public class Supplier {
    public String id;
    public String companyName;
    public String businessType;
    public String gstNumber;
    public String panNumber;
    public String bankName;
    public String accountNumber;
    public String ifsc;
    public String contactPerson;
    public String phone;
    public String email;
    public String address;
    public String status;
    public double rating;
    public int totalOrders;
    public String createdAt;

    public Supplier() {}

    public Supplier(String id, String companyName, String businessType, String gstNumber, String panNumber,
                    String bankName, String accountNumber, String ifsc, String contactPerson, String phone,
                    String email, String address, String status, double rating, int totalOrders, String createdAt) {
        this.id = id;
        this.companyName = companyName;
        this.businessType = businessType;
        this.gstNumber = gstNumber;
        this.panNumber = panNumber;
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.ifsc = ifsc;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.status = status;
        this.rating = rating;
        this.totalOrders = totalOrders;
        this.createdAt = createdAt;
    }
}
