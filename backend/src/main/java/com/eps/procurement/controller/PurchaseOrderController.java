package com.eps.procurement.controller;

import com.eps.procurement.model.PurchaseOrder;
import com.eps.procurement.model.Quotation;
import com.eps.procurement.service.ProcurementService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Purchase order and quotation endpoints. */
@RestController
@RequestMapping("/api")
public class PurchaseOrderController {

    private final ProcurementService procurement;

    public PurchaseOrderController(ProcurementService procurement) {
        this.procurement = procurement;
    }

    @GetMapping("/purchase-orders")
    public Map<String, Object> list(@RequestParam(required = false) String status,
                                    @RequestParam(required = false) String supplierId) {
        return procurement.searchPurchaseOrders(status, supplierId);
    }

    @GetMapping("/purchase-orders/{id}")
    public PurchaseOrder byId(@PathVariable String id) {
        return procurement.purchaseOrderById(id);
    }

    @PostMapping("/purchase-orders")
    public ResponseEntity<PurchaseOrder> create(@RequestBody PurchaseOrder payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.createPurchaseOrder(payload));
    }

    @PatchMapping("/purchase-orders/{id}/status")
    public Map<String, String> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return procurement.updatePurchaseOrderStatus(id, body.get("status"));
    }

    @GetMapping("/quotations")
    public List<Quotation> quotations(@RequestParam(required = false) String requestId) {
        return procurement.quotations(requestId);
    }
}
