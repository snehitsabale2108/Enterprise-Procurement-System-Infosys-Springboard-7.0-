package com.eps.procurement.service;

import com.eps.procurement.model.ApprovalRecord;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.policy.ProcurementPolicy;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** CRUD and lifecycle operations for procurement requests. */
@Service
public class RequestService {

    /** Statuses in which the requester may still edit the request. */
    public static final Set<String> EDITABLE_STATUSES = Set.of("draft", "returned");

    private final DataStore store;
    private final NotificationService notifications;
    private final AuditService audit;

    public RequestService(DataStore store, NotificationService notifications, AuditService audit) {
        this.store = store;
        this.notifications = notifications;
        this.audit = audit;
    }

    /**
     * Category integrity: a laptop can only be raised under Equipment & Assets -> Laptop,
     * and the same guard applies to every other classified item.
     */
    private void assertCategoryIntegrity(ProcurementRequest request) {
        String violation = ProcurementPolicy.validateItemCategory(request.title, request.category,
                request.subcategory);
        if (violation != null) {
            audit.recordBy(request.createdBy, "request_category_rejected", AuditService.ENTITY_REQUEST,
                    request.id, request.category + " -> " + request.subcategory, null, violation);
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, violation);
        }
    }

    /** Suggested category/subcategory for an item title (inline hints in the UI). */
    public Map<String, String> classify(String title) {
        ProcurementPolicy.ItemRule rule = ProcurementPolicy.classifyItem(title);
        if (rule == null) {
            return Map.of();
        }
        return Map.of("category", rule.category(), "subcategory", rule.subcategory());
    }

    public Map<String, Object> search(String status, String department, String category, String createdBy) {
        List<ProcurementRequest> list = store.requests.stream()
                .filter(r -> blank(status) || r.status.equals(status))
                .filter(r -> blank(department) || r.department.equals(department))
                .filter(r -> blank(category) || r.category.equals(category))
                .filter(r -> blank(createdBy) || r.createdBy.equals(createdBy))
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        body.put("totalPages", 1);
        body.put("currentPage", 0);
        return body;
    }

    public ProcurementRequest byId(String id) {
        return store.requests.stream().filter(r -> r.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
    }

    public ProcurementRequest create(ProcurementRequest payload) {
        String now = now();
        payload.id = DataStore.nextId("REQ-2024-", store.requests.size(), 3);
        payload.createdAt = now;
        payload.updatedAt = now;
        if (blank(payload.status)) {
            payload.status = "draft";
        }
        if (blank(payload.priority)) {
            payload.priority = "medium";
        }
        assertCategoryIntegrity(payload);
        store.requests.add(payload);
        audit.recordBy(payload.createdBy, "request_created", AuditService.ENTITY_REQUEST, payload.id, null,
                payload.status, payload.title + " (" + payload.category + " -> " + payload.subcategory + ")");
        if (!"draft".equals(payload.status)) {
            payload.status = "draft";
            submit(payload.id);
        }
        return payload;
    }

    /** Only drafts and returned requests can be edited. */
    public ProcurementRequest update(String id, ProcurementRequest payload) {
        ProcurementRequest existing = byId(id);
        if (!EDITABLE_STATUSES.contains(existing.status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only draft or returned requests can be edited (current status: " + existing.status + ")");
        }
        String previousStatus = existing.status;
        if (!blank(payload.title)) existing.title = payload.title;
        if (!blank(payload.description)) existing.description = payload.description;
        if (!blank(payload.reason)) existing.reason = payload.reason;
        if (!blank(payload.category)) existing.category = payload.category;
        if (!blank(payload.subcategory)) existing.subcategory = payload.subcategory;
        if (payload.quantity > 0) existing.quantity = payload.quantity;
        if (payload.estimatedCost > 0) existing.estimatedCost = payload.estimatedCost;
        if (!blank(payload.department)) existing.department = payload.department;
        if (!blank(payload.requiredDate)) existing.requiredDate = payload.requiredDate;
        if (!blank(payload.priority)) existing.priority = payload.priority;
        assertCategoryIntegrity(existing);
        existing.updatedAt = now();
        audit.recordBy(existing.createdBy, "request_updated", AuditService.ENTITY_REQUEST, existing.id,
                previousStatus, existing.status, "Request edited while " + previousStatus);
        // A returned request that is edited stays editable until it is resubmitted.
        if (!blank(payload.status) && EDITABLE_STATUSES.contains(payload.status)) {
            existing.status = payload.status;
        }
        return existing;
    }

    /** First approval level for an amount, taken from the configured approval rules. */
    public String firstApprovalLevel(double amount) {
        return store.approvalRules.stream()
                .filter(rule -> amount >= rule.minAmount && amount <= rule.maxAmount)
                .findFirst()
                .map(rule -> rule.levels)
                .filter(levels -> levels != null && !levels.isEmpty())
                .map(levels -> levels.get(0))
                .orElse("manager");
    }

    public Map<String, String> submit(String id) {
        ProcurementRequest request = byId(id);
        if (!EDITABLE_STATUSES.contains(request.status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only draft or returned requests can be submitted (current status: " + request.status + ")");
        }
        boolean resubmission = "returned".equals(request.status);
        String level = firstApprovalLevel(request.estimatedCost);
        request.status = ApprovalService.statusForLevel(level);
        request.updatedAt = now();
        // Clear the correction trail once the corrected request is back in the chain.
        request.returnComments = null;
        request.returnedBy = null;
        request.returnedByRole = null;
        request.returnedAt = null;
        request.returnedFromStatus = null;

        audit.recordBy(request.createdBy, resubmission ? "request_resubmitted" : "request_submitted",
                AuditService.ENTITY_REQUEST, request.id, resubmission ? "returned" : "draft", request.status,
                "Routed to " + level + " for approval");

        notifications.pushToRoles(List.of(level), "pending_approval", "New Approval Request",
                request.id + " (" + request.title + ")" + (resubmission ? " was corrected and resubmitted" : "")
                        + " and requires your approval.",
                "/approvals");

        return Map.of("message", resubmission ? "Request resubmitted" : "Request submitted",
                "status", request.status);
    }

    public Map<String, String> cancel(String id) {
        ProcurementRequest request = byId(id);
        String from = request.status;
        request.status = "cancelled";
        request.updatedAt = now();
        audit.recordBy(request.createdBy, "request_cancelled", AuditService.ENTITY_REQUEST, request.id, from,
                "cancelled", "Request cancelled");
        return Map.of("message", "Request cancelled", "status", request.status);
    }

    public List<ApprovalRecord> approvalHistory(String requestId) {
        return store.approvalHistory.stream().filter(h -> h.requestId.equals(requestId)).toList();
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private String now() {
        return LocalDateTime.now().withNano(0).toString();
    }
}
