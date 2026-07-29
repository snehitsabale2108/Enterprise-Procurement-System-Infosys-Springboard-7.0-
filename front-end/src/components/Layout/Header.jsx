import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { notifications as allNotifications } from '../../data/mockData';
import { Bell, LogOut, Search, X, ChevronDown, Check } from 'lucide-react';
import './Layout.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  const userNotifications = allNotifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

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

  const handleNotifClick = (notif) => {
    notif.read = true;
    setShowNotifications(false);
    if (notif.link) navigate(notif.link);
  };

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
                <button className="btn btn-ghost btn-sm" onClick={() => userNotifications.forEach(n => n.read = true)}>
                  <Check size={14} /> Mark all read
                </button>
              </div>
              <div className="notif-dropdown-list">
                {userNotifications.length === 0 ? (
                  <p className="notif-empty">No notifications</p>
                ) : (
                  userNotifications.slice(0, 8).map(n => (
                    <button key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => handleNotifClick(n)}>
                      <div className="notif-item-dot" />
                      <div className="notif-item-content">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-msg">{n.message}</span>
                        <span className="notif-item-time">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
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
              {currentUser?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="header-user-name">{currentUser?.name}</span>
            <ChevronDown size={14} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <div className="avatar" style={{ background: currentUser?.avatar }}>
                  {currentUser?.name?.split(' ').map(n => n[0]).join('')}
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
    </header>
  );
};

export default Header;
