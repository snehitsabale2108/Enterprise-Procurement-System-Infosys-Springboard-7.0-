package com.backend.procurement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PurchaseOrderDto {
    private Long id;
    private String poNumber;
    @NotNull private Long purchaseRequestId;
    @NotNull private Long supplierId;
    private String supplierName;
    private String items;
    @NotNull @Positive private Double amount;
    private String status;
    private LocalDate expectedDelivery;
    private LocalDateTime createdAt;
}
