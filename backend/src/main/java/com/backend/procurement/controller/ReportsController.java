package com.backend.procurement.controller;

import com.backend.procurement.service.ReportsService;
import com.backend.procurement.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> monthly() {
        return ResponseEntity.ok(ApiResponse.ok(reportsService.monthly()));
    }

    @GetMapping("/yearly")
    public ResponseEntity<ApiResponse<Map<String, Object>>> yearly() {
        return ResponseEntity.ok(ApiResponse.ok(reportsService.yearly()));
    }

    @GetMapping("/budget")
    public ResponseEntity<ApiResponse<Map<String, Object>>> budget() {
        return ResponseEntity.ok(ApiResponse.ok(reportsService.budget()));
    }

    @GetMapping("/procurement")
    public ResponseEntity<ApiResponse<Map<String, Object>>> procurement() {
        return ResponseEntity.ok(ApiResponse.ok(reportsService.procurement()));
    }
}
