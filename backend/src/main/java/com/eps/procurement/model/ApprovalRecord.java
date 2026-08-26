package com.eps.procurement.model;

/** One entry of a request's approval trail. */
public class ApprovalRecord {
    public String id;
    public String requestId;
    public String approverName;
    public String approverRole;
    public String action;
    public String comments;
    public String timestamp;

    public ApprovalRecord() {}

    public ApprovalRecord(String id, String requestId, String approverName, String approverRole,
                          String action, String comments, String timestamp) {
        this.id = id;
        this.requestId = requestId;
        this.approverName = approverName;
        this.approverRole = approverRole;
        this.action = action;
        this.comments = comments;
        this.timestamp = timestamp;
    }
}
