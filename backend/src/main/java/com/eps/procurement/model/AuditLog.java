package com.eps.procurement.model;

/** An immutable audit trail entry. */
public class AuditLog {
    public String id;
    public String userId;
    public String userName;
    public String role;
    public String action;
    public String entity;
    public String entityId;
    public String previousValue;
    public String updatedValue;
    public String ipAddress;
    public String timestamp;
    public String remarks;

    public AuditLog() {}

    public AuditLog(String id, String userId, String userName, String role, String action, String entity,
                    String entityId, String previousValue, String updatedValue, String ipAddress,
                    String timestamp, String remarks) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.role = role;
        this.action = action;
        this.entity = entity;
        this.entityId = entityId;
        this.previousValue = previousValue;
        this.updatedValue = updatedValue;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
        this.remarks = remarks;
    }
}
