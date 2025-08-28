import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Activity,
  LogIn,
  LogOut,
  Upload,
  Edit,
  Trash2,
  Eye,
  User,
  Calendar,
  Clock,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import { dbHelpers } from '../../../config/supabase';

export const ActivityLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user: '',
    action: 'all',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 50
  });
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState(null);

  const actionTypes = [
    { value: 'login', label: 'Login', icon: LogIn },
    { value: 'logout', label: 'Logout', icon: LogOut },
    { value: 'profile_update', label: 'Profile Update', icon: Edit },
    { value: 'content_upload', label: 'Content Upload', icon: Upload },
    { value: 'content_view', label: 'Content View', icon: Eye },
    { value: 'member_created', label: 'Member Created', icon: User },
    { value: 'member_updated', label: 'Member Updated', icon: Edit },
    { value: 'member_deleted', label: 'Member Deleted', icon: Trash2 },
    { value: 'content_verified', label: 'Content Verified', icon: Eye },
    { value: 'dashboard_access', label: 'Dashboard Access', icon: Activity },
    { value: 'password_change', label: 'Password Change', icon: Edit }
  ];

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await dbHelpers.getActivityLogs(filters);
      
      if (error) {
        console.error('Error fetching activity logs:', error);
        return;
      }

      setLogs(data || []);
      setTotalLogs(data?.length || 0);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const exportLogs = () => {
    // Implementation for exporting logs
    console.log('Exporting logs...');
  };

  const getActionIcon = (actionType) => {
    const action = actionTypes.find(a => a.value === actionType);
    return action ? action.icon : Activity;
  };

  const getActionLabel = (actionType) => {
    const action = actionTypes.find(a => a.value === actionType);
    return action ? action.label : actionType.replace('_', ' ');
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDeviceInfo = (userAgent) => {
    if (!userAgent) return { type: 'Unknown', name: 'Unknown Device' };
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
      return { type: 'mobile', name: 'Mobile Device' };
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      return { type: 'tablet', name: 'Tablet' };
    } else {
      return { type: 'desktop', name: 'Desktop' };
    }
  };

  const getDeviceIcon = (userAgent) => {
    const device = getDeviceInfo(userAgent);
    switch (device.type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Monitor;
      default:
        return Monitor;
    }
  };

  return (
    <div className="activity-logs-tab">
      <div className="tab-header">
        <div className="header-left">
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-subtitle">Monitor user activities and system events</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-secondary"
            onClick={fetchLogs}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            Refresh
          </button>
          <button
            className="btn btn-secondary"
            onClick={exportLogs}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="logs-controls">
        <div className="controls-row">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Actions</option>
              {actionTypes.map(action => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="date-input"
              placeholder="From date"
            />

            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="date-input"
              placeholder="To date"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading activity logs...</p>
        </div>
      ) : (
        <>
          <div className="logs-summary">
            <div className="summary-item">
              <span className="summary-value">{totalLogs}</span>
              <span className="summary-label">Total Activities</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">
                {logs.filter(log => {
                  const logDate = new Date(log.created_at);
                  const today = new Date();
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </span>
              <span className="summary-label">Today</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">
                {new Set(logs.map(log => log.user_id)).size}
              </span>
              <span className="summary-label">Active Users</span>
            </div>
          </div>

          {logs.length > 0 ? (
            <div className="logs-table-container">
              <table className="activity-logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Description</th>
                    <th>IP Address</th>
                    <th>Device</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <LogRow 
                      key={log.id}
                      log={log}
                      onViewDetails={() => setSelectedLog(log)}
                      getActionIcon={getActionIcon}
                      getActionLabel={getActionLabel}
                      formatDateTime={formatDateTime}
                      getDeviceIcon={getDeviceIcon}
                      getDeviceInfo={getDeviceInfo}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Activity className="empty-icon" size={48} />
              <h3>No activity logs found</h3>
              <p>No activities match your current filters.</p>
            </div>
          )}
        </>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogDetailModal 
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          formatDateTime={formatDateTime}
          getActionIcon={getActionIcon}
          getActionLabel={getActionLabel}
          getDeviceInfo={getDeviceInfo}
        />
      )}
    </div>
  );
};

// Log Row Component
const LogRow = ({ 
  log, 
  onViewDetails, 
  getActionIcon, 
  getActionLabel, 
  formatDateTime, 
  getDeviceIcon,
  getDeviceInfo 
}) => {
  const ActionIcon = getActionIcon(log.action_type);
  const DeviceIcon = getDeviceIcon(log.user_agent);
  const deviceInfo = getDeviceInfo(log.user_agent);
  
  return (
    <tr className="log-row">
      <td className="timestamp">
        <div className="timestamp-content">
          <Clock size={14} />
          {formatDateTime(log.created_at)}
        </div>
      </td>
      <td className="user-info">
        <div className="user-content">
          <div className="user-avatar">
            {log.users?.profile_image_url ? (
              <img 
                src={log.users.profile_image_url} 
                alt={log.users.name}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {log.users?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div className="user-details">
            <div className="user-name">{log.users?.name || 'Unknown User'}</div>
            <div className="user-email">{log.users?.email}</div>
          </div>
        </div>
      </td>
      <td className="action-type">
        <div className="action-badge">
          <ActionIcon size={16} className="action-icon" />
          {getActionLabel(log.action_type)}
        </div>
      </td>
      <td className="action-description">
        {log.action_description}
      </td>
      <td className="ip-address">
        <div className="ip-content">
          <Globe size={14} />
          {log.ip_address || 'N/A'}
        </div>
      </td>
      <td className="device-info">
        <div className="device-content">
          <DeviceIcon size={16} />
          {deviceInfo.name}
        </div>
      </td>
      <td className="actions">
        <button
          className="details-btn"
          onClick={onViewDetails}
          title="View details"
        >
          <Eye size={16} />
        </button>
      </td>
    </tr>
  );
};

// Log Detail Modal Component
const LogDetailModal = ({ 
  log, 
  onClose, 
  formatDateTime, 
  getActionIcon, 
  getActionLabel,
  getDeviceInfo 
}) => {
  const ActionIcon = getActionIcon(log.action_type);
  const deviceInfo = getDeviceInfo(log.user_agent);
  
  return (
    <div className="modal-overlay">
      <div className="modal-container log-detail-modal">
        <div className="modal-header">
          <h2 className="modal-title">Activity Log Details</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="log-detail">
            <div className="detail-section">
              <h3 className="section-title">Action Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Action Type:</span>
                  <div className="detail-value">
                    <ActionIcon size={16} />
                    {getActionLabel(log.action_type)}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{log.action_description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Timestamp:</span>
                  <span className="detail-value">{formatDateTime(log.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">User Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">User:</span>
                  <div className="detail-value user-info">
                    <div className="user-avatar">
                      {log.users?.profile_image_url ? (
                        <img 
                          src={log.users.profile_image_url} 
                          alt={log.users.name}
                          className="avatar-image"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {log.users?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="user-name">{log.users?.name || 'Unknown User'}</div>
                      <div className="user-email">{log.users?.email}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Technical Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">IP Address:</span>
                  <span className="detail-value">{log.ip_address || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Device:</span>
                  <span className="detail-value">{deviceInfo.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">User Agent:</span>
                  <span className="detail-value user-agent">
                    {log.user_agent || 'N/A'}
                  </span>
                </div>
                {log.session_id && (
                  <div className="detail-item">
                    <span className="detail-label">Session ID:</span>
                    <span className="detail-value session-id">{log.session_id}</span>
                  </div>
                )}
              </div>
            </div>

            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="detail-section">
                <h3 className="section-title">Additional Data</h3>
                <div className="metadata-content">
                  <pre className="metadata-json">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
