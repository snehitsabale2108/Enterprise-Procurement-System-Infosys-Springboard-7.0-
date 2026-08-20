package com.eps.procurement.service;

import com.eps.procurement.model.AuditLog;
import com.eps.procurement.model.User;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * Writes and queries the append-only audit trail.
 *
 * <p>Every read is returned newest-first so the Audit Logs page and the per-entity
 * trails on detail views are consistent.
 */
@Service
public class AuditService {

    /** Canonical entity names used across the audit trail. */
    public static final String ENTITY_REQUEST = "request";
    public static final String ENTITY_RFQ = "rfq";
    public static final String ENTITY_QUOTATION = "quotation";
    public static final String ENTITY_VENDOR_AWARD = "vendor_award";
    public static final String ENTITY_PURCHASE_ORDER = "purchase_order";
    public static final String ENTITY_PAYMENT = "payment";

    private final DataStore store;

    public AuditService(DataStore store) {
        this.store = store;
    }

    public AuditLog record(User user, String action, String entity, String entityId,
                           String previousValue, String updatedValue, String remarks) {
        AuditLog log = new AuditLog(
                DataStore.nextId("AL", store.auditLogs.size(), 3),
                user == null ? "SYSTEM" : user.id,
                user == null ? "System" : user.name,
                user == null ? "system" : user.role,
                action, entity, entityId, previousValue, updatedValue,
                "127.0.0.1", LocalDateTime.now().withNano(0).toString(), remarks);
        store.auditLogs.add(log);
        return log;
    }

    /** Records an entry for an actor referenced by user id (falls back to SYSTEM). */
    public AuditLog recordBy(String actorId, String action, String entity, String entityId,
                             String previousValue, String updatedValue, String remarks) {
        return record(userById(actorId), action, entity, entityId, previousValue, updatedValue, remarks);
    }

    /** Records an entry attributed to the first active user holding the given role. */
    public AuditLog recordByRole(String role, String action, String entity, String entityId,
                                 String previousValue, String updatedValue, String remarks) {
        User user = role == null ? null : store.users.stream()
                .filter(u -> role.equalsIgnoreCase(u.role))
                .findFirst()
                .orElse(null);
        return record(user, action, entity, entityId, previousValue, updatedValue, remarks);
    }

    public User userById(String actorId) {
        if (actorId == null || actorId.isBlank()) {
            return null;
        }
        return store.users.stream()
                .filter(u -> actorId.equalsIgnoreCase(u.id) || actorId.equalsIgnoreCase(u.email))
                .findFirst()
                .orElse(null);
    }

    /** Newest-first, optionally filtered. Used by the Audit Logs page. */
    public Map<String, Object> search(String userId, String action, String entity) {
        return search(userId, action, entity, null);
    }

    public Map<String, Object> search(String userId, String action, String entity, String entityId) {
        List<AuditLog> logs = newestFirst(store.auditLogs.stream()
                .filter(l -> blank(userId) || userId.equalsIgnoreCase(l.userId))
                .filter(l -> blank(action) || action.equalsIgnoreCase(l.action))
                .filter(l -> blank(entity) || entity.equalsIgnoreCase(l.entity))
                .filter(l -> blank(entityId) || entityId.equalsIgnoreCase(l.entityId))
                .toList());
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", logs);
        body.put("totalElements", logs.size());
        body.put("totalPages", 1);
        return body;
    }

    /** Full newest-first trail for a single entity (request, RFQ, quotation, award or PO). */
    public List<AuditLog> trail(String entity, String entityId) {
        return newestFirst(store.auditLogs.stream()
                .filter(l -> blank(entity) || entity.equalsIgnoreCase(l.entity))
                .filter(l -> blank(entityId) || entityId.equalsIgnoreCase(l.entityId))
                .toList());
    }

    /**
     * The complete trail for a request: the request itself plus every RFQ, quotation,
     * vendor award and purchase order linked to it, newest-first.
     */
    public List<AuditLog> trailForRequest(String requestId) {
        List<String> ids = new java.util.ArrayList<>();
        ids.add(requestId);
        store.rfqs.stream().filter(r -> requestId.equalsIgnoreCase(r.requestId)).forEach(r -> ids.add(r.id));
        store.quotations.stream().filter(q -> requestId.equalsIgnoreCase(q.requestId)).forEach(q -> ids.add(q.id));
        store.purchaseOrders.stream().filter(p -> requestId.equalsIgnoreCase(p.requestId)).forEach(p -> ids.add(p.id));
        store.payments.stream()
                .filter(p -> requestId.equalsIgnoreCase(p.requestId) || ids.contains(p.poNumber))
                .forEach(p -> ids.add(p.id));
        return newestFirst(store.auditLogs.stream()
                .filter(l -> ids.stream().anyMatch(id -> id != null && id.equalsIgnoreCase(l.entityId)))
                .toList());
    }

    private List<AuditLog> newestFirst(List<AuditLog> logs) {
        return logs.stream()
                .sorted(Comparator.comparing((AuditLog l) -> l.timestamp == null ? "" : l.timestamp)
                        .thenComparing(l -> l.id == null ? "" : l.id)
                        .reversed())
                .toList();
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}
