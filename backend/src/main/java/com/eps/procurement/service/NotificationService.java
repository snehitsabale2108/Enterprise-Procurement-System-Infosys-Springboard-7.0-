package com.eps.procurement.service;

import com.eps.procurement.model.Notification;
import com.eps.procurement.store.DataStore;
import java.util.*;
import org.springframework.stereotype.Service;

/** In-app notification feed. */
@Service
public class NotificationService {

    private final DataStore store;

    public NotificationService(DataStore store) {
        this.store = store;
    }

    public Map<String, Object> forUser(String userId) {
        List<Notification> list = store.notifications.stream()
                .filter(n -> userId == null || userId.isBlank() || n.userId.equals(userId))
                .toList();
        long unread = list.stream().filter(n -> !n.read).count();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("unreadCount", unread);
        body.put("totalElements", list.size());
        return body;
    }

    public Map<String, Object> markAsRead(String id) {
        store.notifications.stream().filter(n -> n.id.equals(id)).forEach(n -> n.read = true);
        return Map.of("message", "Notification marked as read");
    }

    public Map<String, Object> markAllAsRead(String userId) {
        store.notifications.stream()
                .filter(n -> userId == null || userId.isBlank() || n.userId.equals(userId))
                .forEach(n -> n.read = true);
        return Map.of("message", "All notifications marked as read");
    }
}
