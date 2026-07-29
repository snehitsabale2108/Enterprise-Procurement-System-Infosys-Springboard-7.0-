package com.backend.procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Long departmentId;
    private String departmentName;
    private boolean active;
}
