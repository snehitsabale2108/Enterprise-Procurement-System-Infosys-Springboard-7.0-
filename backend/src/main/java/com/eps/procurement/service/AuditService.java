package com.eps.procurement.service;

import com.eps.procurement.model.AuditLog;
import com.eps.procurement.model.User;
import com.eps.procurement.store.DataStore;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

/** Writes and queries the audit trail. */
@Service
public class AuditService {

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

    public Map<String, Object> search(String userId, String action, String entity) {
        List<AuditLog> logs = store.auditLogs.stream()
                .filter(l -> userId == null || userId.isBlank() || l.userId.equals(userId))
                .filter(l -> action == null || action.isBlank() || l.action.equals(action))
                .filter(l -> entity == null || entity.isBlank() || l.entity.equals(entity))
                .toList();
        return Map.of("content", logs, "totalElements", logs.size(), "totalPages", 1);
    }
}
