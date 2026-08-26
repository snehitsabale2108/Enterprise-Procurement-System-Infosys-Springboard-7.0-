package com.eps.procurement.controller;

import com.eps.procurement.model.Payment;
import com.eps.procurement.service.FinanceService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** Finance endpoints: /api/payments/** */
@RestController
@RequestMapping("/api/payments")
public class FinanceController {

    private final FinanceService finance;

    public FinanceController(FinanceService finance) {
        this.finance = finance;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String search) {
        return finance.searchPayments(status, search);
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return finance.summary();
    }

    @GetMapping("/{id}")
    public Payment byId(@PathVariable String id) {
        return finance.byId(id);
    }

    @GetMapping("/{id}/audit-trail")
    public List<com.eps.procurement.model.AuditLog> trail(@PathVariable String id) {
        return finance.trail(id);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, Object> body) {
        return finance.verifyInvoice(body);
    }

    @PostMapping("/{id}/release")
    public Map<String, Object> release(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return finance.releasePayment(id, body);
    }

    @PostMapping("/{id}/confirm")
    public Map<String, Object> confirm(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return finance.confirmPayment(id, body);
    }

    @PostMapping("/{id}/status")
    public Map<String, Object> status(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return finance.updateStatus(id, body);
    }

    @PostMapping("/process")
    public Map<String, Object> process(@RequestBody Map<String, Object> body) {
        return finance.processPayment(body);
    }
}
