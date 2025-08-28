import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu,
  Home,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminHeader = ({ user, onToggleSidebar, sidebarCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'content',
      message: 'New content uploaded by John Smith',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'member',
      message: 'New member registration: Sarah Johnson',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'system',
      message: 'Weekly analytics report is ready',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className="mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search members, content, logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <Link to="/" className="action-button" title="Go to Homepage">
            <Home size={20} />
          </Link>

          <button
            className="action-button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="notifications-container">
            <button
              className="action-button notifications-trigger"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown">
                <div className="notifications-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-all-read">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        <div className="notification-content">
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <span className="notification-time">
                            {notification.time}
                          </span>
                        </div>
                        {notification.unread && (
                          <div className="notification-dot"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-notifications">
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="notifications-footer">
                  <button className="view-all-button">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="user-menu">
            <div className="user-info">
              <div className="user-avatar">
                {user?.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.name}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-details">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="notifications-overlay"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};
