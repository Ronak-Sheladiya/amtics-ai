import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DashboardOverview } from './tabs/DashboardOverview';
import { MembersTab } from './tabs/MembersTab';
import { ContentVerificationTab } from './tabs/ContentVerificationTab';
import { ActivityLogsTab } from './tabs/ActivityLogsTab';
import { AdminProfileTab } from './tabs/AdminProfileTab';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'members':
        return <MembersTab />;
      case 'content-verification':
        return <ContentVerificationTab />;
      case 'activity-logs':
        return <ActivityLogsTab />;
      case 'profile':
        return <AdminProfileTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-dashboard" data-theme={theme}>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader
          user={user}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="dashboard-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};
