package com.backend.procurement.controller;

import com.backend.procurement.dto.NotificationDto;
import com.backend.procurement.security.AuthenticatedUserProvider;
import com.backend.procurement.service.NotificationService;
import com.backend.procurement.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list() {
        return ResponseEntity.ok(ApiResponse.ok(notificationService.summary(authenticatedUserProvider.currentUser())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Marked read",
                notificationService.markRead(id, authenticatedUserProvider.currentUser())));
    }
}
