package com.eps.procurement.service;

import com.eps.procurement.model.ApprovalRecord;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** CRUD and lifecycle operations for procurement requests. */
@Service
public class RequestService {

    private final DataStore store;

    public RequestService(DataStore store) {
        this.store = store;
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
        String now = LocalDateTime.now().withNano(0).toString();
        payload.id = DataStore.nextId("REQ-2024-", store.requests.size(), 3);
        payload.createdAt = now;
        payload.updatedAt = now;
        if (blank(payload.status)) {
            payload.status = "draft";
        }
        if (blank(payload.priority)) {
            payload.priority = "medium";
        }
        store.requests.add(payload);
        return payload;
    }

    public ProcurementRequest update(String id, ProcurementRequest payload) {
        ProcurementRequest existing = byId(id);
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
        if (!blank(payload.status)) existing.status = payload.status;
        existing.updatedAt = LocalDateTime.now().withNano(0).toString();
        return existing;
    }

    public Map<String, String> submit(String id) {
        ProcurementRequest request = byId(id);
        request.status = "pending_manager";
        request.updatedAt = LocalDateTime.now().withNano(0).toString();
        return Map.of("message", "Request submitted", "status", request.status);
    }

    public Map<String, String> cancel(String id) {
        ProcurementRequest request = byId(id);
        request.status = "cancelled";
        request.updatedAt = LocalDateTime.now().withNano(0).toString();
        return Map.of("message", "Request cancelled", "status", request.status);
    }

    public List<ApprovalRecord> approvalHistory(String requestId) {
        return store.approvalHistory.stream().filter(h -> h.requestId.equals(requestId)).toList();
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}
