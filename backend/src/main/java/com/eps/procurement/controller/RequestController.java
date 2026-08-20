package com.eps.procurement.controller;

import com.eps.procurement.model.ApprovalRecord;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.service.RequestService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Procurement request endpoints: /api/requests/** */
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requests;

    public RequestController(RequestService requests) {
        this.requests = requests;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String department,
                                    @RequestParam(required = false) String category,
                                    @RequestParam(required = false) String createdBy) {
        return requests.search(status, department, category, createdBy);
    }

    @GetMapping("/{id}")
    public ProcurementRequest byId(@PathVariable String id) {
        return requests.byId(id);
    }

    @PostMapping
    public ResponseEntity<ProcurementRequest> create(@RequestBody ProcurementRequest payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(requests.create(payload));
    }

    @PutMapping("/{id}")
    public ProcurementRequest update(@PathVariable String id, @RequestBody ProcurementRequest payload) {
        return requests.update(id, payload);
    }

    @PatchMapping("/{id}/submit")
    public Map<String, String> submit(@PathVariable String id) {
        return requests.submit(id);
    }

    @PatchMapping("/{id}/cancel")
    public Map<String, String> cancel(@PathVariable String id) {
        return requests.cancel(id);
    }

    /** Suggested (mandatory) category/subcategory for an item title. */
    @GetMapping("/classify")
    public Map<String, String> classify(@RequestParam String title) {
        return requests.classify(title);
    }

    @GetMapping("/{id}/approval-history")
    public List<ApprovalRecord> history(@PathVariable String id) {
        return requests.approvalHistory(id);
    }
}
