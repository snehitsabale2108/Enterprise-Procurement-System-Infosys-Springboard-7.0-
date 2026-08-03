package com.eps.procurement.controller;

import com.eps.procurement.service.FinanceService;
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
    public Map<String, Object> list(@RequestParam(required = false) String status) {
        return finance.searchPayments(status);
    }

    @PostMapping("/verify")
    public Map<String, Object> verify(@RequestBody Map<String, Object> body) {
        return finance.verifyInvoice(body);
    }

    @PostMapping("/process")
    public Map<String, Object> process(@RequestBody Map<String, Object> body) {
        return finance.processPayment(body);
    }
}
