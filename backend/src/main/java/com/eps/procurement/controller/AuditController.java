package com.eps.procurement.controller;

import com.eps.procurement.model.AuditLog;
import com.eps.procurement.service.AuditService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/**
 * Audit trail endpoints. All responses are newest-first.
 *
 * <ul>
 *   <li>GET /api/audit-trail?entity=purchase_order&amp;entityId=PO-2024-001</li>
 *   <li>GET /api/audit-trail/requests/{requestId} — request + RFQs + quotations + award + POs</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/audit-trail")
public class AuditController {

    private final AuditService audit;

    public AuditController(AuditService audit) {
        this.audit = audit;
    }

    @GetMapping
    public Map<String, Object> trail(@RequestParam(required = false) String entity,
                                     @RequestParam(required = false) String entityId,
                                     @RequestParam(required = false) String userId,
                                     @RequestParam(required = false) String action) {
        return audit.search(userId, action, entity, entityId);
    }

    @GetMapping("/requests/{requestId}")
    public List<AuditLog> requestTrail(@PathVariable String requestId) {
        return audit.trailForRequest(requestId);
    }

    @GetMapping("/{entity}/{entityId}")
    public List<AuditLog> entityTrail(@PathVariable String entity, @PathVariable String entityId) {
        return audit.trail(entity, entityId);
    }
}
