package com.backend.procurement.dto.response;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {

    private Integer id;

    private String fullName;

    private String email;

    private String role;

    private String department;

    private String token;

}

