package com.eps.procurement.controller;

import com.eps.procurement.service.NotificationService;
import java.util.Map;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/** Notification endpoints: /api/notifications/** */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notifications;

    public NotificationController(NotificationService notifications) {
        this.notifications = notifications;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String userId) {
        return notifications.forUser(userId);
    }

    /** Live notification stream (Server-Sent Events) for one user. */
    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestParam(required = false) String userId) {
        return notifications.subscribe(userId);
    }

    @PatchMapping("/{id}/read")
    public Map<String, Object> markRead(@PathVariable String id) {
        return notifications.markAsRead(id);
    }

    @PatchMapping("/read-all")
    public Map<String, Object> markAllRead(@RequestParam(required = false) String userId) {
        return notifications.markAllAsRead(userId);
    }
}
