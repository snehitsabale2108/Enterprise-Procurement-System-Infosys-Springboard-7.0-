package com.backend.procurement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SupplierDto {
    private Long id;
    @NotBlank private String name;
    private String contactPerson;
    private String phone;
    private String email;
    private String address;
    private String status;
    private Double rating;
    private LocalDate kycExpiry;
}
