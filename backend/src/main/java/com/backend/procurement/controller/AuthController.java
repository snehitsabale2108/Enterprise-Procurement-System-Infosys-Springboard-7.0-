package com.backend.procurement.controller;

import com.backend.procurement.dto.*;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.AuthService;
import com.backend.procurement.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("User registered", authService.register(req)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(req)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        String token = authService.forgotPassword(req);
        return ResponseEntity.ok(ApiResponse.ok("Reset token issued", Map.of("resetToken", token)));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.ok("Password reset", null));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> profile() {
        return ResponseEntity.ok(ApiResponse.ok(Mappers.toDto(authenticatedUserProvider.currentUser())));
    }
}
