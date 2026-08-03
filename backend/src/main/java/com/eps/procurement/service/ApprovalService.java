package com.eps.procurement.service;

import com.eps.procurement.model.ApprovalRecord;
import com.eps.procurement.model.ApprovalRule;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.stereotype.Service;

/** Implements the multi-level, amount-based approval workflow. */
@Service
public class ApprovalService {

    private final DataStore store;
    private final RequestService requests;

    public ApprovalService(DataStore store, RequestService requests) {
        this.store = store;
        this.requests = requests;
    }

    /** Statuses that map to each approver role. */
    private String pendingStatusFor(String role) {
        return switch (role == null ? "" : role.replace('-', '_')) {
            case "manager" -> "pending_manager";
            case "senior_manager" -> "pending_senior_manager";
            case "head" -> "pending_head";
            default -> null;
        };
    }

    public Map<String, Object> pending(String role) {
        String status = pendingStatusFor(role);
        List<ProcurementRequest> list = store.requests.stream()
                .filter(r -> status != null && r.status.equals(status))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    /** Approval levels required for an amount, taken from the configured rules. */
    public List<String> levelsFor(double amount) {
        return store.approvalRules.stream()
                .filter(rule -> amount >= rule.minAmount && amount <= rule.maxAmount)
                .findFirst()
                .map(rule -> rule.levels)
                .orElse(List.of("manager"));
    }

    public Map<String, Object> approve(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        List<String> levels = levelsFor(request.estimatedCost);
        String current = request.status;
        String next = switch (current) {
            case "pending_manager" -> levels.contains("senior_manager") ? "pending_senior_manager" : "approved";
            case "pending_senior_manager" -> levels.contains("head") ? "pending_head" : "approved";
            default -> "approved";
        };
        request.status = next;
        request.updatedAt = LocalDateTime.now().withNano(0).toString();

        ApprovalRecord record = addRecord(requestId, approverRole, "approved", comments);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request approved");
        body.put("newStatus", next);
        body.put("approvalRecord", record);
        return body;
    }

    public Map<String, Object> reject(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        request.status = "rejected";
        request.updatedAt = LocalDateTime.now().withNano(0).toString();
        ApprovalRecord record = addRecord(requestId, approverRole, "rejected", comments);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request rejected");
        body.put("newStatus", "rejected");
        body.put("approvalRecord", record);
        return body;
    }

    public Map<String, Object> returnForCorrection(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        request.status = "draft";
        request.updatedAt = LocalDateTime.now().withNano(0).toString();
        ApprovalRecord record = addRecord(requestId, approverRole, "returned", comments);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request returned for correction");
        body.put("newStatus", "draft");
        body.put("approvalRecord", record);
        return body;
    }

    public List<ApprovalRule> rules() {
        return store.approvalRules;
    }

    private ApprovalRecord addRecord(String requestId, String approverRole, String action, String comments) {
        String role = approverRole == null ? "manager" : approverRole.replace('-', '_');
        String approverName = store.users.stream()
                .filter(u -> u.role.equals(role))
                .map(u -> u.name)
                .findFirst()
                .orElse("System Approver");
        ApprovalRecord record = new ApprovalRecord(
                DataStore.nextId("AH", store.approvalHistory.size(), 3),
                requestId, approverName, role, action,
                comments == null ? "" : comments,
                LocalDateTime.now().withNano(0).toString());
        store.approvalHistory.add(record);
        return record;
    }
}
