package com.backend.procurement.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class PurchaseRequestCreateDto {
    @NotBlank private String category;
    @NotBlank private String description;
    @NotNull @Positive private Integer quantity;
    @NotNull @Positive private Double estimatedCost;
    private String justification;
    private String priority;
    private Long departmentId;
}
