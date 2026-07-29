package com.backend.procurement.controller;

import com.backend.procurement.dto.PaymentDto;
import com.backend.procurement.service.PaymentService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.findAll()));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<PaymentDto>>> history() {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.history()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<PaymentDto>> create(@Valid @RequestBody PaymentDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Payment recorded", paymentService.create(dto)));
    }
}
