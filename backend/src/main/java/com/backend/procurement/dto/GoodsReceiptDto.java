package com.backend.procurement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class GoodsReceiptDto {
    private Long id;
    private String grnNumber;
    @NotNull private Long purchaseOrderId;
    @NotNull @Positive private Integer receivedQuantity;
    private Integer acceptedQuantity;
    private Integer rejectedQuantity;
    private String inspectionStatus;
    private String remarks;
    private LocalDateTime receivedAt;
}
