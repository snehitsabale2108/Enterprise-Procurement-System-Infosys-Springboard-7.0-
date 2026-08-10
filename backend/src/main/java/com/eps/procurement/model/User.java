package com.eps.procurement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

/** An application user (employee, approver, procurement/finance staff or admin). */
public class User {
    public String id;
    public String name;
    public String email;
    public String role;
    public String department;
    public String avatar;
    public String phone;
    public String status;
    public String supplierId;
    public String createdAt;

    @JsonIgnore
    public String password;

    public User() {}

    public User(String id, String name, String email, String role, String department,
                String avatar, String phone, String status, String createdAt, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.avatar = avatar;
        this.phone = phone;
        this.status = status;
        this.createdAt = createdAt;
        this.password = password;
    }

    public User(String id, String name, String email, String role, String department,
                String avatar, String phone, String status, String supplierId, String createdAt, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.department = department;
        this.avatar = avatar;
        this.phone = phone;
        this.status = status;
        this.supplierId = supplierId;
        this.createdAt = createdAt;
        this.password = password;
    }
}
