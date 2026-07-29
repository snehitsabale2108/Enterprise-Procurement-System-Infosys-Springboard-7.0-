package com.backend.procurement.controller;

import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.DashboardService;
import com.backend.procurement.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping("/employee")
    @PreAuthorize("hasAnyRole('EMPLOYEE','MANAGER','SENIOR_MANAGER','HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> employee() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.employee(authenticatedUserProvider.currentUser())));
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> manager() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.manager()));
    }

    @GetMapping("/senior-manager")
    @PreAuthorize("hasAnyRole('SENIOR_MANAGER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> seniorManager() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.seniorManager()));
    }

    @GetMapping("/head")
    @PreAuthorize("hasAnyRole('HEAD','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> head() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.head()));
    }

    @GetMapping("/finance")
    @PreAuthorize("hasAnyRole('FINANCE_OFFICER','ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> finance() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.finance()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> admin() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.admin()));
    }
}
