package com.eps.procurement.controller;

import com.eps.procurement.store.DataStore;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health check plus a single bootstrap payload the React client loads at startup,
 * so every screen renders data served by this Spring Boot backend.
 */
@RestController
@RequestMapping("/api")
public class BootstrapController {

    private final DataStore store;

    public BootstrapController(DataStore store) {
        this.store = store;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "eps-backend");
    }

    @GetMapping("/bootstrap")
    public Map<String, Object> bootstrap() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("users", store.users);
        body.put("departments", store.departments);
        body.put("categories", store.categories);
        body.put("requests", store.requests);
        body.put("approvalHistory", store.approvalHistory);
        body.put("suppliers", store.suppliers);
        body.put("purchaseOrders", store.purchaseOrders);
        body.put("goodsReceiptNotes", store.goodsReceiptNotes);
        body.put("softwareLicenses", store.softwareLicenses);
        body.put("payments", store.payments);
        body.put("notifications", store.notifications);
        body.put("quotations", store.quotations);
        body.put("auditLogs", store.auditLogs);
        body.put("approvalRules", store.approvalRules);
        body.put("roles", store.roles);
        body.put("chartData", store.chartData());
        return body;
    }
}
