package com.backend.procurement.controller;

import com.backend.procurement.dto.PurchaseOrderDto;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.PurchaseOrderService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseOrderDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(purchaseOrderService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(purchaseOrderService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> create(@Valid @RequestBody PurchaseOrderDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Created",
                purchaseOrderService.create(dto, authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> update(@PathVariable Long id, @RequestBody PurchaseOrderDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", purchaseOrderService.update(id, dto)));
    }
}
