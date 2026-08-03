package com.eps.procurement.controller;

import com.eps.procurement.service.ApprovalService;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

/** Approval workflow endpoints: /api/approvals/** */
@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    private final ApprovalService approvals;

    public ApprovalController(ApprovalService approvals) {
        this.approvals = approvals;
    }

    @GetMapping("/pending")
    public Map<String, Object> pending(@RequestParam String role) {
        return approvals.pending(role);
    }

    @PostMapping("/{requestId}/approve")
    public Map<String, Object> approve(@PathVariable String requestId, @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return approvals.approve(requestId, payload.get("comments"), payload.get("approverRole"));
    }

    @PostMapping("/{requestId}/reject")
    public Map<String, Object> reject(@PathVariable String requestId, @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return approvals.reject(requestId, payload.get("comments"), payload.get("approverRole"));
    }

    @PostMapping("/{requestId}/return")
    public Map<String, Object> returnForCorrection(@PathVariable String requestId, @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        return approvals.returnForCorrection(requestId, payload.get("comments"), payload.get("approverRole"));
    }
}
