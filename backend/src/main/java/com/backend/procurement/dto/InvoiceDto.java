package com.backend.procurement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class InvoiceDto {
    private Long id;
    private String invoiceNumber;
    @NotNull private Long purchaseOrderId;
    private Long supplierId;
    @NotNull @Positive private Double amount;
    private String status;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
}
