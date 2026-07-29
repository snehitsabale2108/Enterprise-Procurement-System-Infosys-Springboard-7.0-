package com.backend.procurement.controller;

import com.backend.procurement.dto.PurchaseRequestCreateDto;
import com.backend.procurement.dto.PurchaseRequestDto;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.PurchaseRequestService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-requests")
@RequiredArgsConstructor
public class PurchaseRequestController {

    private final PurchaseRequestService purchaseRequestService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PurchaseRequestDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(purchaseRequestService.findAll()));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<PurchaseRequestDto>>> my() {
        return ResponseEntity.ok(ApiResponse.ok(purchaseRequestService.findMy(authenticatedUserProvider.currentUser())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> findOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(purchaseRequestService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> create(@Valid @RequestBody PurchaseRequestCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase request created",
                purchaseRequestService.create(dto, authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PurchaseRequestDto>> update(@PathVariable Long id,
                                                                  @Valid @RequestBody PurchaseRequestCreateDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Purchase request updated",
                purchaseRequestService.update(id, dto, authenticatedUserProvider.currentUser())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        purchaseRequestService.delete(id, authenticatedUserProvider.currentUser());
        return ResponseEntity.ok(ApiResponse.ok("Purchase request deleted", null));
    }
}
