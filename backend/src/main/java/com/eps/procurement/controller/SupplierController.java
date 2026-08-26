package com.eps.procurement.controller;

import com.eps.procurement.model.Supplier;
import com.eps.procurement.service.ProcurementService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Supplier endpoints: /api/suppliers/** */
@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final ProcurementService procurement;

    public SupplierController(ProcurementService procurement) {
        this.procurement = procurement;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String search) {
        return procurement.searchSuppliers(status, search);
    }

    @GetMapping("/{id}")
    public Supplier byId(@PathVariable String id) {
        return procurement.supplierById(id);
    }

    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.createSupplier(payload));
    }

    @PutMapping("/{id}")
    public Supplier update(@PathVariable String id, @RequestBody Supplier payload) {
        return procurement.updateSupplier(id, payload);
    }

    @PatchMapping("/{id}/status")
    public Map<String, String> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return procurement.updateSupplierStatus(id, body.get("status"));
    }

    @GetMapping("/portal/dashboard/{supplierId}")
    public Map<String, Object> portalStats(@PathVariable String supplierId) {
        return procurement.getSupplierPortalStats(supplierId);
    }

    @GetMapping("/portal/profile/{supplierId}")
    public Supplier portalProfile(@PathVariable String supplierId) {
        return procurement.supplierById(supplierId);
    }

    @PutMapping("/portal/profile/{supplierId}")
    public Supplier updatePortalProfile(@PathVariable String supplierId, @RequestBody Supplier payload) {
        return procurement.updateSupplier(supplierId, payload);
    }
}
