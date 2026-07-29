package com.backend.procurement.controller;

import com.backend.procurement.dto.InvoiceDto;
import com.backend.procurement.service.InvoiceService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceDto>> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InvoiceDto>> create(@Valid @RequestBody InvoiceDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Created", invoiceService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceDto>> update(@PathVariable Long id, @RequestBody InvoiceDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", invoiceService.update(id, dto)));
    }
}
