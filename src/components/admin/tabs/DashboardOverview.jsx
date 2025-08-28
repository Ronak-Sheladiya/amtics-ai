import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Upload, 
  TrendingUp, 
  TrendingDown,
  Activity,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';

export const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    activeMembers: 0,
    newThisMonth: 0,
    pendingContent: 0,
    recentActivities: [],
    registrationTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get dashboard stats
      const { data: stats, error: statsError } = await dbHelpers.getDashboardStats();
      
      if (statsError) {
        console.error('Error fetching stats:', statsError);
      } else if (stats) {
        setAnalytics(prev => ({
          ...prev,
          totalMembers: stats.total_members || 0,
          activeMembers: stats.active_members || 0,
          newThisMonth: stats.new_this_month || 0,
          pendingContent: stats.pending_content || 0
        }));
      }

      // Get recent activities
      const { data: activities, error: activitiesError } = await dbHelpers.getActivityLogs({
        limit: 10
      });
      
      if (activitiesError) {
        console.error('Error fetching activities:', activitiesError);
      } else if (activities) {
        setAnalytics(prev => ({
          ...prev,
          recentActivities: activities
        }));
      }

      // Get registration trend
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const { data: trend, error: trendError } = await dbHelpers.getRegistrationTrend(days);
      
      if (trendError) {
        console.error('Error fetching trend:', trendError);
      } else if (trend) {
        setAnalytics(prev => ({
          ...prev,
          registrationTrend: trend
        }));
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyticsCards = [
    {
      title: 'Total Members',
      value: analytics.totalMembers,
      change: analytics.newThisMonth > 0 ? `+${analytics.newThisMonth} this month` : 'No new members',
      changeType: analytics.newThisMonth > 0 ? 'positive' : 'neutral',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Members',
      value: analytics.activeMembers,
      change: `${Math.round((analytics.activeMembers / analytics.totalMembers) * 100) || 0}% of total`,
      changeType: 'neutral',
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Pending Content',
      value: analytics.pendingContent,
      change: analytics.pendingContent > 5 ? 'Needs attention' : 'Under control',
      changeType: analytics.pendingContent > 5 ? 'negative' : 'positive',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Recent Activity',
      value: analytics.recentActivities.length,
      change: 'Last 24 hours',
      changeType: 'neutral',
      icon: Activity,
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-overview">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        {analyticsCards.map((card, index) => (
          <AnalyticsCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Member Registration Trend</h3>
            <p>Registration activity over time</p>
          </div>
          <div className="chart-content">
            <RegistrationChart data={analytics.registrationTrend} />
          </div>
        </div>

        <div className="quick-stats">
          <h3>Quick Statistics</h3>
          <div className="stats-list">
            <div className="stat-item">
              <FileText className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Total Content</span>
                <span className="stat-value">0</span>
              </div>
            </div>
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">This Week</span>
                <span className="stat-value">{analytics.recentActivities.length}</span>
              </div>
            </div>
            <div className="stat-item">
              <Eye className="stat-icon" />
              <div className="stat-content">
                <span className="stat-label">Page Views</span>
                <span className="stat-value">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <button className="view-all-button">View All</button>
        </div>
        <div className="activity-feed">
          {analytics.recentActivities.length > 0 ? (
            analytics.recentActivities.slice(0, 8).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))
          ) : (
            <div className="no-activity">
              <Activity className="no-activity-icon" />
              <p>No recent activity to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Analytics Card Component
const AnalyticsCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const getTrendIcon = () => {
    if (changeType === 'positive') return <TrendingUp className="trend-icon positive" />;
    if (changeType === 'negative') return <TrendingDown className="trend-icon negative" />;
    return null;
  };

  return (
    <div className={`analytics-card ${color}`}>
      <div className="card-header">
        <div className="card-icon">
          <Icon size={24} />
        </div>
        <div className="card-trend">
          {getTrendIcon()}
        </div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value">{value}</div>
        <div className={`card-change ${changeType}`}>
          {change}
        </div>
      </div>
    </div>
  );
};

// Registration Chart Component (Simple)
const RegistrationChart = ({ data }) => {
  const chartData = data || [];
  
  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        <p>No registration data available</p>
      </div>
    );
  }

  // Group by date and count
  const dateGroups = chartData.reduce((acc, item) => {
    const date = new Date(item.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartEntries = Object.entries(dateGroups);
  const maxValue = Math.max(...Object.values(dateGroups));

  return (
    <div className="simple-chart">
      {chartEntries.map(([date, count]) => (
        <div key={date} className="chart-bar">
          <div 
            className="bar"
            style={{ 
              height: `${(count / maxValue) * 100}%`,
              minHeight: '4px'
            }}
          ></div>
          <span className="bar-label">{date.split('/')[1]}/{date.split('/')[0]}</span>
          <span className="bar-value">{count}</span>
        </div>
      ))}
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
  const getActivityIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return <UserCheck className="activity-icon login" />;
      case 'logout':
        return <Users className="activity-icon logout" />;
      case 'content_upload':
        return <Upload className="activity-icon upload" />;
      case 'profile_update':
        return <Users className="activity-icon update" />;
      default:
        return <Activity className="activity-icon default" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="activity-item">
      <div className="activity-avatar">
        {activity.users?.profile_image_url ? (
          <img 
            src={activity.users.profile_image_url} 
            alt={activity.users.name}
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            {activity.users?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="activity-content">
        <div className="activity-description">
          <strong>{activity.users?.name || 'Unknown User'}</strong> {activity.action_description}
        </div>
        <div className="activity-time">
          {formatTime(activity.created_at)}
        </div>
      </div>
      <div className="activity-type">
        {getActivityIcon(activity.action_type)}
      </div>
    </div>
  );
};
