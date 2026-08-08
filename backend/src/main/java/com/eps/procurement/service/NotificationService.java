package com.eps.procurement.service;
import com.eps.procurement.model.Notification;
import com.eps.procurement.model.User;
import com.eps.procurement.store.DataStore;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

// In-app notification feed with real-time delivery.

@Service
public class NotificationService {

    private final DataStore store;

    /** userId -> open SSE connections for that user. */
    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public NotificationService(DataStore store) {
        this.store = store;
    }

    // ── Feed ──────────────────────────────────────────────────
    public Map<String, Object> forUser(String userId) {
        List<Notification> list = store.notifications.stream()
                .filter(n -> userId == null || userId.isBlank() || n.userId.equals(userId))
                .sorted(Comparator.comparing((Notification n) -> n.createdAt == null ? "" : n.createdAt).reversed())
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

    // ── Real-time stream ──────────────────────────────────────
    public SseEmitter subscribe(String userId) {
        SseEmitter emitter = new SseEmitter(0L); // no timeout
        String key = userId == null ? "*" : userId;
        emitters.computeIfAbsent(key, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> remove(key, emitter));
        emitter.onTimeout(() -> remove(key, emitter));
        emitter.onError(e -> remove(key, emitter));

        try {
            emitter.send(SseEmitter.event().name("connected")
                    .data(Map.of("userId", key, "unreadCount", unreadCount(userId))));
        } catch (IOException ignored) {
            remove(key, emitter);
        }
        return emitter;
    }

    private void remove(String key, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(key);
        if (list != null) {
            list.remove(emitter);
        }
    }

    private long unreadCount(String userId) {
        return store.notifications.stream()
                .filter(n -> userId == null || n.userId.equals(userId))
                .filter(n -> !n.read)
                .count();
    }

    private void broadcast(Notification notification) {
        List<SseEmitter> targets = new ArrayList<>();
        targets.addAll(emitters.getOrDefault(notification.userId, List.of()));
        targets.addAll(emitters.getOrDefault("*", List.of()));
        for (SseEmitter emitter : targets) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(notification));
            } catch (Exception e) {
                emitter.complete();
            }
        }
    }

    // ── Creating notifications ────────────────────────────────
    /** Creates a notification for one user and pushes it out over SSE straight away. */
    public Notification push(String userId, String type, String title, String message, String link) {
        if (userId == null || userId.isBlank()) {
            return null;
        }
        Notification notification = new Notification(
                DataStore.nextId("N", store.notifications.size(), 3),
                userId, type, title, message, false,
                LocalDateTime.now().withNano(0).toString(), link);
        store.notifications.add(notification);
        broadcast(notification);
        return notification;
    }

    /** Notifies every active user holding one of the given roles. */
    public void pushToRoles(Collection<String> roles, String type, String title, String message, String link) {
        store.users.stream()
                .filter(u -> "active".equals(u.status))
                .filter(u -> roles.contains(u.role))
                .map(u -> u.id)
                .forEach(id -> push(id, type, title, message, link));
    }

    /** Notifies the supplier-portal login(s) linked to a supplier record. */
    public void pushToSupplier(String supplierId, String type, String title, String message, String link) {
        store.users.stream()
                .filter(u -> "supplier".equals(u.role) && supplierId != null && supplierId.equals(u.supplierId))
                .map(u -> u.id)
                .forEach(id -> push(id, type, title, message, link));
    }

    public Optional<User> userById(String id) {
        return store.users.stream().filter(u -> u.id.equals(id)).findFirst();
    }
}
