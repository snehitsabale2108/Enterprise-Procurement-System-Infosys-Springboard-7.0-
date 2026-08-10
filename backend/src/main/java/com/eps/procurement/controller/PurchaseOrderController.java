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

    @PostMapping("/purchase-orders/{id}/accept")
    public PurchaseOrder acceptOrder(@PathVariable String id) {
        return procurement.acceptPurchaseOrder(id);
    }

    @PostMapping("/purchase-orders/{id}/reject")
    public PurchaseOrder rejectOrder(@PathVariable String id, @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", body.get("reclineReason"));
        return procurement.rejectPurchaseOrder(id, reason);
    }

    @PostMapping("/purchase-orders/{id}/invoice")
    public PurchaseOrder uploadInvoice(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String invoiceNumber = String.valueOf(body.getOrDefault("invoiceNumber", "INV-" + id));
        double invoiceAmount = body.get("invoiceAmount") != null ? Double.parseDouble(body.get("invoiceAmount").toString()) : 0;
        String fileName = body.get("invoiceFileName") != null ? body.get("invoiceFileName").toString() : null;
        return procurement.uploadInvoice(id, invoiceNumber, invoiceAmount, fileName);
    }

    @GetMapping("/quotations")
    public List<Quotation> quotations(@RequestParam(required = false) String requestId) {
        return procurement.quotations(requestId);
    }

    @PostMapping("/quotations")
    public ResponseEntity<Quotation> submitQuotation(@RequestBody Quotation payload) {
        return ResponseEntity.status(HttpStatus.CREATED).body(procurement.submitQuotation(payload));
    }
}
