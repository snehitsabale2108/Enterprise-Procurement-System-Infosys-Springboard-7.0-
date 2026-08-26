package com.eps.procurement.controller;

import com.eps.procurement.model.Quotation;
import com.eps.procurement.service.ProcurementService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Quotation endpoints: /api/quotations/** (supplier submission, finance approval, vendor award). */
@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final ProcurementService procurement;

    public QuotationController(ProcurementService procurement) {
        this.procurement = procurement;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String requestId,
                                    @RequestParam(required = false) String financeStatus,
                                    @RequestParam(required = false) String supplierId) {
        return procurement.searchQuotations(requestId, financeStatus, supplierId);
    }

    @GetMapping("/{id}")
    public Quotation byId(@PathVariable String id) {
        return procurement.quotationById(id);
    }

    @PostMapping
    public ResponseEntity<Quotation> submit(@RequestBody Quotation payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.submitQuotation(payload));
    }

    /** Finance approval / rejection of a submitted quotation. */
    @PostMapping("/{id}/finance-review")
    public Quotation financeReview(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Object decision = body.getOrDefault("approve", body.get("decision"));
        boolean approve = Boolean.TRUE.equals(decision)
                || "true".equalsIgnoreCase(String.valueOf(decision))
                || "approve".equalsIgnoreCase(String.valueOf(decision))
                || "approved".equalsIgnoreCase(String.valueOf(decision));
        String comments = body.get("comments") == null ? null : String.valueOf(body.get("comments"));
        String reviewedBy = body.get("reviewedBy") == null ? null : String.valueOf(body.get("reviewedBy"));
        return procurement.reviewQuotation(id, approve, comments, reviewedBy);
    }

    /** Procurement officer awards the request to the vendor behind this quotation. */
    @PostMapping("/{id}/select")
    public Map<String, Object> selectVendor(@PathVariable String id,
                                           @RequestBody(required = false) Map<String, String> body) {
        Map<String, String> payload = body == null ? Map.of() : body;
        String actorId = payload.get("actorId") != null ? payload.get("actorId")
                : payload.getOrDefault("selectedBy", "U006");
        return procurement.selectVendor(id, actorId, payload.get("deliveryDate"));
    }
}
