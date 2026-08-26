import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from '../../services/notificationService';
import { Bell, LogOut, Search, ChevronDown, Check } from 'lucide-react';
import './Layout.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userNotifications, setUserNotifications] = useState([]);
  const [toast, setToast] = useState(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    const list = (await getNotifications(currentUser.id)) || [];
    setUserNotifications(
      [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    );
  }, [currentUser?.id]);

  // Initial load + live stream (SSE against the backend, event bus in demo mode)
  useEffect(() => {
    load();
    if (!currentUser?.id) return undefined;
    const unsubscribe = subscribeToNotifications(currentUser.id, (notification) => {
      setUserNotifications((prev) =>
        prev.some((n) => n.id === notification.id) ? prev : [notification, ...prev],
      );
      setToast(notification);
    });
    return unsubscribe;
  }, [currentUser?.id, load]);

  // Auto-dismiss the live toast
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotifClick = async (notif) => {
    await markAsRead(notif.id);
    setUserNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)),
    );
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAll = async () => {
    await markAllAsRead(currentUser.id);
    setUserNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const time = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="search-box header-search">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search requests, suppliers, POs..." />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-notif-wrapper" ref={notifRef}>
          <button
            className="btn-icon header-icon-btn"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <h3>Notifications</h3>
                <button className="btn btn-ghost btn-sm" onClick={handleMarkAll}>
                  <Check size={14} /> Mark all read
                </button>
              </div>
              <div className="notif-dropdown-list">
                {userNotifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : (
                  userNotifications.slice(0, 10).map((n) => (
                    <button key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => handleNotifClick(n)}>
                      <div className="notif-item-dot" />
                      <div className="notif-item-content">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-msg">{n.message}</span>
                        <span className="notif-item-time">{time(n.createdAt)}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header-user-wrapper" ref={userMenuRef}>
          <button
            className="header-user-btn"
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
          >
            <div className="avatar avatar-sm" style={{ background: currentUser?.avatar }}>
              {currentUser?.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <span className="header-user-name">{currentUser?.name}</span>
            <ChevronDown size={14} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="avatar" style={{ background: currentUser?.avatar }}>
                  {currentUser?.name?.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="user-dropdown-name">{currentUser?.name}</p>
                  <p className="user-dropdown-role">{currentUser?.role?.replace(/_/g, ' ')}</p>
                  <p className="user-dropdown-dept">{currentUser?.department}</p>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <button className="user-dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live notification toast */}
      {toast && (
        <button
          className="live-notif-toast"
          onClick={() => { handleNotifClick(toast); setToast(null); }}
        >
          <Bell size={16} />
          <span>
            <strong>{toast.title}</strong>
            <em>{toast.message}</em>
          </span>
        </button>
      )}
    </header>
  );
};

export default Header;
