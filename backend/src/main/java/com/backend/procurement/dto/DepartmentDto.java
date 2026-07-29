package com.backend.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DepartmentDto {
    private Long id;
    @NotBlank private String name;
    private String description;
    private Double budgetAllocated;
    private Double budgetUsed;
}
