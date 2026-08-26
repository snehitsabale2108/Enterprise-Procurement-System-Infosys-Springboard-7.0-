package com.eps.procurement.service;

import com.eps.procurement.model.ApprovalRecord;
import com.eps.procurement.model.ApprovalRule;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Multi-level, amount-based approval workflow.
 *
 * <p>The chain is derived from the configured approval rules (not hardcoded amounts),
 * so an approval always moves to the next configured level and only becomes
 * {@code approved} after the last level has signed off. Every transition raises a
 * live notification for the people who have to act next.
 */
@Service
public class ApprovalService {

    private final DataStore store;
    private final RequestService requests;
    private final NotificationService notifications;

    private final AuditService audit;

    public ApprovalService(DataStore store, RequestService requests, NotificationService notifications,
                           AuditService audit) {
        this.audit = audit;
        this.store = store;
        this.requests = requests;
        this.notifications = notifications;
    }

    /** Approver roles handled by this workflow, in escalation order. */
    public static final List<String> CHAIN = List.of("manager", "senior_manager", "head");

    public static String statusForLevel(String role) {
        return "pending_" + role.replace('-', '_');
    }

    public static String roleForStatus(String status) {
        if (status == null || !status.startsWith("pending_")) return null;
        String role = status.substring("pending_".length());
        return CHAIN.contains(role) ? role : null;
    }

    /** Approval levels required for an amount, taken from the configured rules. */
    public List<String> levelsFor(double amount) {
        return store.approvalRules.stream()
                .filter(rule -> amount >= rule.minAmount && amount <= rule.maxAmount)
                .findFirst()
                .map(rule -> rule.levels)
                .filter(levels -> levels != null && !levels.isEmpty())
                .orElse(List.of("manager"));
    }

    public Map<String, Object> pending(String role) {
        String normalised = role == null ? "" : role.replace('-', '_');
        String status = CHAIN.contains(normalised) ? statusForLevel(normalised) : null;
        List<ProcurementRequest> list = status == null ? List.of()
                : store.requests.stream().filter(r -> status.equals(r.status)).toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public Map<String, Object> approve(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        String currentRole = roleForStatus(request.status);
        if (currentRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Request " + requestId + " is not awaiting approval (status: " + request.status + ")");
        }
        String actingRole = approverRole == null || approverRole.isBlank()
                ? currentRole : approverRole.replace('-', '_');
        if (!actingRole.equals(currentRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This request is awaiting the " + currentRole.replace('_', ' ') + " approval");
        }

        List<String> levels = levelsFor(request.estimatedCost);
        int index = levels.indexOf(currentRole);
        String nextRole = (index >= 0 && index + 1 < levels.size()) ? levels.get(index + 1) : null;
        String next = nextRole == null ? "approved" : statusForLevel(nextRole);

        String previousStatus = statusForLevel(currentRole);
        request.status = next;
        request.updatedAt = now();
        ApprovalRecord record = addRecord(requestId, actingRole, "approved", comments);
        audit.recordByRole(actingRole, "request_approved", AuditService.ENTITY_REQUEST, requestId,
                previousStatus, next,
                (comments == null || comments.isBlank() ? "Approved by " : comments + " — approved by ")
                        + actingRole.replace('_', ' '));

        if (nextRole == null) {
            request.procurementStage = "rfq_pending";
            notifications.push(request.createdBy, "request_approved", "Request Approved",
                    "Your request " + requestId + " has been fully approved and moved to procurement.",
                    "/requests/" + requestId);
            notifications.pushToRoles(List.of("procurement_officer"), "request_approved",
                    "Ready for Procurement",
                    requestId + " (" + request.title + ") is approved and ready for vendor sourcing.",
                    "/procurement");
        } else {
            notifications.pushToRoles(List.of(nextRole), "pending_approval", "New Approval Request",
                    requestId + " (" + request.title + ") requires your approval.", "/approvals");
            notifications.push(request.createdBy, "request_approved", "Approval Progress",
                    requestId + " was approved by the " + actingRole.replace('_', ' ')
                            + " and is now with the " + nextRole.replace('_', ' ') + ".",
                    "/requests/" + requestId);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request approved");
        body.put("newStatus", next);
        body.put("nextApprover", nextRole);
        body.put("approvalRecord", record);
        return body;
    }

    public Map<String, Object> reject(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        String currentRole = roleForStatus(request.status);
        if (currentRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is not awaiting approval");
        }
        String previousStatus = request.status;
        request.status = "rejected";
        request.updatedAt = now();
        ApprovalRecord record = addRecord(requestId, approverRole == null ? currentRole : approverRole,
                "rejected", comments);
        audit.recordByRole(approverRole == null ? currentRole : approverRole, "request_rejected",
                AuditService.ENTITY_REQUEST, requestId, previousStatus, "rejected",
                comments == null || comments.isBlank() ? "Request rejected" : comments);
        notifications.push(request.createdBy, "request_rejected", "Request Rejected",
                requestId + " was rejected. " + (comments == null || comments.isBlank() ? "" : "Reason: " + comments),
                "/requests/" + requestId);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request rejected");
        body.put("newStatus", "rejected");
        body.put("approvalRecord", record);
        return body;
    }

    /**
     * Returns a request to the requester for correction. The request goes back to an
     * editable draft state ({@code returned}) keeping the reviewer's comments, so the
     * requester can fix and resubmit it instead of raising a brand new request.
     */
    public Map<String, Object> returnForCorrection(String requestId, String comments, String approverRole) {
        ProcurementRequest request = requests.byId(requestId);
        String currentRole = roleForStatus(request.status);
        if (currentRole == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request is not awaiting approval");
        }
        String actingRole = approverRole == null || approverRole.isBlank() ? currentRole : approverRole.replace('-', '_');
        String actingName = approverName(actingRole);

        request.returnedFromStatus = request.status;
        request.status = "returned";
        request.returnComments = comments == null ? "" : comments;
        request.returnedBy = actingName;
        request.returnedByRole = actingRole;
        request.returnedAt = now();
        request.updatedAt = now();

        ApprovalRecord record = addRecord(requestId, actingRole, "returned", comments);
        audit.recordByRole(actingRole, "request_returned", AuditService.ENTITY_REQUEST, requestId,
                request.returnedFromStatus, "returned",
                "Returned for correction by " + actingName
                        + (comments == null || comments.isBlank() ? "" : ": " + comments));
        notifications.push(request.createdBy, "request_returned", "Request Returned for Correction",
                requestId + " was returned by " + actingName + ". You can edit and resubmit it."
                        + (comments == null || comments.isBlank() ? "" : " Note: " + comments),
                "/requests/" + requestId + "/edit");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Request returned for correction");
        body.put("newStatus", "returned");
        body.put("editable", true);
        body.put("approvalRecord", record);
        return body;
    }

    public List<ApprovalRule> rules() {
        return store.approvalRules;
    }

    private String approverName(String role) {
        return store.users.stream()
                .filter(u -> role.equals(u.role))
                .map(u -> u.name)
                .findFirst()
                .orElse("System Approver");
    }

    private ApprovalRecord addRecord(String requestId, String approverRole, String action, String comments) {
        String role = approverRole == null ? "manager" : approverRole.replace('-', '_');
        ApprovalRecord record = new ApprovalRecord(
                DataStore.nextId("AH", store.approvalHistory.size(), 3),
                requestId, approverName(role), role, action,
                comments == null ? "" : comments, now());
        store.approvalHistory.add(record);
        return record;
    }

    private String now() {
        return LocalDateTime.now().withNano(0).toString();
    }
}
