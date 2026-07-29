package com.backend.procurement.service;

import com.backend.procurement.dto.NotificationDto;
import com.backend.procurement.entity.Notification;
import com.backend.procurement.entity.User;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(User user, String type, String title, String message) {
        Notification n = Notification.builder()
                .user(user).type(type).title(title).message(message)
                .read(false).createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(n);
    }

    public List<NotificationDto> listForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(Mappers::toDto).toList();
    }

    public Map<String, Object> summary(User user) {
        long unread = notificationRepository.countByUserAndReadFalse(user);
        return Map.of("unreadCount", unread,
                "notifications", listForUser(user));
    }

    @Transactional
    public NotificationDto markRead(Long id, User user) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", id));
        if (!n.getUser().getId().equals(user.getId()))
            throw new ResourceNotFoundException("Notification", id);
        n.setRead(true);
        return Mappers.toDto(notificationRepository.save(n));
    }
}
