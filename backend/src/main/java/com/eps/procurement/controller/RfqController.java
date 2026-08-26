package com.eps.procurement.controller;

import com.eps.procurement.model.Rfq;
import com.eps.procurement.service.ProcurementService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** RFQ endpoints: /api/rfqs/** */
@RestController
@RequestMapping("/api/rfqs")
public class RfqController {

    private final ProcurementService procurement;

    public RfqController(ProcurementService procurement) {
        this.procurement = procurement;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String supplierId,
                                    @RequestParam(required = false) String status,
                                    @RequestParam(required = false) String requestId) {
        return procurement.searchRfqs(supplierId, status, requestId);
    }

    @GetMapping("/{id}")
    public Rfq byId(@PathVariable String id) {
        return procurement.rfqById(id);
    }

    @PostMapping
    public ResponseEntity<Rfq> create(@RequestBody Rfq payload,
                                      @RequestParam(required = false) String actorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.createRfq(payload, actorId));
    }

    @PatchMapping("/{id}/availability")
    public Rfq updateAvailability(@PathVariable String id, @RequestBody Map<String, String> body) {
        String availability = body.getOrDefault("productAvailability", body.get("availability"));
        return procurement.updateRfqAvailability(id, availability);
    }

    @PostMapping("/{id}/decline")
    public Rfq decline(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("declineReason", body.get("reason"));
        String remarks = body.getOrDefault("declineRemarks", body.get("remarks"));
        return procurement.declineRfq(id, reason, remarks);
    }
}
