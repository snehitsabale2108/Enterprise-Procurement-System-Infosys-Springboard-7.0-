package com.eps.procurement.controller;

import com.eps.procurement.model.GoodsReceiptNote;
import com.eps.procurement.model.SoftwareLicense;
import com.eps.procurement.service.ProcurementService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Goods receipt note and software licence endpoints. */
@RestController
@RequestMapping("/api")
public class GrnController {

    private final ProcurementService procurement;

    public GrnController(ProcurementService procurement) {
        this.procurement = procurement;
    }

    @GetMapping("/grn")
    public Map<String, Object> list(@RequestParam(required = false) String poNumber,
                                    @RequestParam(required = false) String status) {
        return procurement.searchGrns(poNumber, status);
    }

    @PostMapping("/grn")
    public ResponseEntity<GoodsReceiptNote> create(@RequestBody GoodsReceiptNote payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.createGrn(payload));
    }

    @PatchMapping("/grn/{id}/handover")
    public GoodsReceiptNote handover(@PathVariable String id) {
        return procurement.confirmHandover(id);
    }

    @GetMapping("/licenses")
    public List<SoftwareLicense> licenses() {
        return procurement.licenses();
    }
}
