package com.procurement.model;

public class UserRole {
    private int userId;
    private String fullName;
    private String roleName;

    public UserRole(int userId, String fullName, String roleName) {
        this.userId = userId;
        this.fullName = fullName;
        this.roleName = roleName;
    }

    public int getUserId() { return userId; }
    public String getFullName() { return fullName; }
    public String getRoleName() { return roleName; }
}