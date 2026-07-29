package com.backend.procurement.controller;

import com.backend.procurement.dto.GoodsReceiptDto;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.GoodsReceiptService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goods-receipts")
@RequiredArgsConstructor
public class GoodsReceiptController {

    private final GoodsReceiptService goodsReceiptService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GoodsReceiptDto>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(goodsReceiptService.findAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GoodsReceiptDto>> create(@Valid @RequestBody GoodsReceiptDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Created",
                goodsReceiptService.create(dto, authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GoodsReceiptDto>> update(@PathVariable Long id, @RequestBody GoodsReceiptDto dto) {
        return ResponseEntity.ok(ApiResponse.ok("Updated", goodsReceiptService.update(id, dto)));
    }
}
