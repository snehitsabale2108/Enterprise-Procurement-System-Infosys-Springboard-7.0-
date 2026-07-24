package com.backend.procurement.dto.response;
import lombok.*;

@Data
@AllArgsConstructor
public class ApiResponse {

    private boolean success;

    private String message;

}