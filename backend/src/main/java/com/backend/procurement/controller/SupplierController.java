package com.backend.procurement.controller;

import com.backend.procurement.dto.SupplierDto;
import com.backend.procurement.service.SupplierService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SupplierDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierDto>> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierDto>> create(@Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Created", supplierService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierDto>> update(@PathVariable Long id, @Valid @RequestBody SupplierDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", supplierService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
