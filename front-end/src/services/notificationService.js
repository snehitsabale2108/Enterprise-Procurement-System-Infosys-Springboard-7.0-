import { apiCall, isMockMode, API_BASE_URL } from './apiConfig';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeNotifications as subscribeMockNotifications,
} from '../store/epsStore';

// ============================================
// Notification Service (live)
// ============================================

/**
 * GET /notifications?userId=string
 */
export const getNotifications = async (userId) => {
  if (!isMockMode()) {
    return apiCall(`/notifications?userId=${userId}`);
  }
  return getUserNotifications(userId);
};

/** PATCH /notifications/:id/read */
export const markAsRead = async (id) => {
  if (!isMockMode()) {
    return apiCall(`/notifications/${id}/read`, { method: 'PATCH' });
  }
  markNotificationRead(id);
  return { message: 'Marked as read' };
};

/** PATCH /notifications/read-all?userId=string */
export const markAllAsRead = async (userId) => {
  if (!isMockMode()) {
    return apiCall(`/notifications/read-all?userId=${userId}`, { method: 'PATCH' });
  }
  markAllNotificationsRead(userId);
  return { message: 'All notifications marked as read' };
};

/**
 * Live notification stream.
 *
 * Mock mode  -> in-app event bus (store).
 * API mode   -> Server-Sent Events from GET /notifications/stream?userId=...
 *
 * Returns an unsubscribe function; always call it on unmount.
 */
export const subscribeToNotifications = (userId, onNotification) => {
  if (!userId || typeof onNotification !== 'function') return () => {};

  if (isMockMode()) {
    return subscribeMockNotifications((notification) => {
      if (notification.userId === userId) onNotification(notification);
    });
  }

  let source;
  let closed = false;
  let retry;

  const connect = () => {
    if (closed) return;
    source = new EventSource(
      `${API_BASE_URL}/notifications/stream?userId=${encodeURIComponent(userId)}`,
      { withCredentials: true },
    );

    source.addEventListener('notification', (event) => {
      try {
        onNotification(JSON.parse(event.data));
      } catch (err) {
        console.error('Bad notification payload', err);
      }
    });

    source.onerror = () => {
      source.close();
      if (!closed) retry = setTimeout(connect, 5000); // auto-reconnect
    };
  };

  connect();

  return () => {
    closed = true;
    clearTimeout(retry);
    source?.close();
  };
};
