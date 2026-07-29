package com.backend.procurement.controller;

import com.backend.procurement.dto.PurchaseOrderDto;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.PurchaseOrderService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement/orders")
@RequiredArgsConstructor
public class ProcurementOfficerController {

    private final PurchaseOrderService purchaseOrderService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<List<PurchaseOrderDto>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(purchaseOrderService.findAll()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> create(@Valid @RequestBody PurchaseOrderDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase order created",
                purchaseOrderService.create(dto, authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROCUREMENT_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<PurchaseOrderDto>> update(@PathVariable Long id, @RequestBody PurchaseOrderDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", purchaseOrderService.update(id, dto)));
    }
}
