import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Activity, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const AdminSidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const { user, signOut } = useAuth();

  const tabs = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Analytics and overview'
    },
    { 
      id: 'members', 
      label: 'Members', 
      icon: Users,
      description: 'Manage team members'
    },
    { 
      id: 'content-verification', 
      label: 'Content Verification', 
      icon: FileCheck,
      description: 'Review uploaded content'
    },
    { 
      id: 'activity-logs', 
      label: 'Activity Logs', 
      icon: Activity,
      description: 'User activity tracking'
    },
    { 
      id: 'profile', 
      label: 'Profile Settings', 
      icon: User,
      description: 'Edit your profile'
    }
  ];

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      window.location.href = '/';
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="sidebar-overlay"
          onClick={onToggleCollapse}
        />
      )}

      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {!collapsed && (
              <>
                <img
                  src="/logo.png"
                  alt="AMTICS Media"
                  className="sidebar-logo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="brand-text">
                  <h2>AMTICS</h2>
                  <span>Admin Panel</span>
                </div>
              </>
            )}
          </div>
          <button
            className="sidebar-toggle"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                    title={collapsed ? tab.label : ''}
                  >
                    <IconComponent className="nav-icon" size={20} />
                    {!collapsed && (
                      <div className="nav-content">
                        <span className="nav-label">{tab.label}</span>
                        <span className="nav-description">{tab.description}</span>
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
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
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.position || user?.user_role}</div>
              </div>
            )}
          </div>

          <button
            className="logout-button"
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : ''}
          >
            <LogOut className="logout-icon" size={20} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
