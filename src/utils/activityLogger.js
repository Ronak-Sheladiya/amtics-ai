import { supabase } from '../config/supabase.js';

// Activity Logger Utilities
export class ActivityLogger {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Core logging function
  async log(userId, actionType, description, metadata = {}) {
    try {
      if (!userId || !actionType) {
        console.error('ActivityLogger: userId and actionType are required');
        return { success: false, error: 'Missing required parameters' };
      }

      const logData = {
        user_id: userId,
        action_type: actionType,
        action_description: description || '',
        session_id: this.sessionId,
        user_agent: this.userAgent,
        metadata: {
          timestamp: new Date().toISOString(),
          ...metadata
        }
      };

      // Add IP address if available (would be set by backend)
      if (metadata.ip_address) {
        logData.ip_address = metadata.ip_address;
      }

      const { data, error } = await supabase
        .from('user_activity_logs')
        .insert(logData)
        .select()
        .single();

      if (error) {
        console.error('ActivityLogger error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('ActivityLogger exception:', error);
      return { success: false, error: error.message };
    }
  }

  // Authentication activities
  async logLogin(userId, metadata = {}) {
    return await this.log(userId, 'login', 'User logged in', {
      login_time: new Date().toISOString(),
      ...metadata
    });
  }

  async logLogout(userId, metadata = {}) {
    return await this.log(userId, 'logout', 'User logged out', {
      logout_time: new Date().toISOString(),
      session_duration: metadata.sessionDuration,
      ...metadata
    });
  }

  async logPasswordChange(userId, metadata = {}) {
    return await this.log(userId, 'password_change', 'User changed password', {
      ...metadata
    });
  }

  async logFirstLogin(userId, metadata = {}) {
    return await this.log(userId, 'first_login', 'User completed first login setup', {
      onboarding_completed: true,
      ...metadata
    });
  }

  // Profile activities
  async logProfileUpdate(userId, updatedFields, metadata = {}) {
    return await this.log(userId, 'profile_update', `Updated profile fields: ${updatedFields.join(', ')}`, {
      updated_fields: updatedFields,
      ...metadata
    });
  }

  async logProfileImageUpdate(userId, metadata = {}) {
    return await this.log(userId, 'profile_image_update', 'Updated profile image', {
      image_size: metadata.imageSize,
      image_type: metadata.imageType,
      ...metadata
    });
  }

  // Content activities
  async logContentUpload(userId, contentId, contentType, title, metadata = {}) {
    return await this.log(userId, 'content_upload', `Uploaded ${contentType}: ${title}`, {
      content_id: contentId,
      content_type: contentType,
      content_title: title,
      file_size: metadata.fileSize,
      mime_type: metadata.mimeType,
      ...metadata
    });
  }

  async logContentView(userId, contentId, contentTitle, metadata = {}) {
    return await this.log(userId, 'content_view', `Viewed content: ${contentTitle}`, {
      content_id: contentId,
      content_title: contentTitle,
      view_duration: metadata.viewDuration,
      ...metadata
    });
  }

  async logContentUpdate(userId, contentId, contentTitle, updatedFields, metadata = {}) {
    return await this.log(userId, 'content_update', `Updated content: ${contentTitle}`, {
      content_id: contentId,
      content_title: contentTitle,
      updated_fields: updatedFields,
      ...metadata
    });
  }

  async logContentDelete(userId, contentId, contentTitle, metadata = {}) {
    return await this.log(userId, 'content_delete', `Deleted content: ${contentTitle}`, {
      content_id: contentId,
      content_title: contentTitle,
      was_verified: metadata.wasVerified,
      ...metadata
    });
  }

  // Admin activities
  async logAdminAction(adminId, actionType, description, metadata = {}) {
    return await this.log(adminId, `admin_${actionType}`, description, {
      admin_action: true,
      ...metadata
    });
  }

  async logMemberCreated(adminId, newMemberId, memberName, metadata = {}) {
    return await this.log(adminId, 'admin_member_created', `Created new member: ${memberName}`, {
      admin_action: true,
      target_user_id: newMemberId,
      member_name: memberName,
      ...metadata
    });
  }

  async logMemberUpdated(adminId, memberId, memberName, updatedFields, metadata = {}) {
    return await this.log(adminId, 'admin_member_updated', `Updated member: ${memberName}`, {
      admin_action: true,
      target_user_id: memberId,
      member_name: memberName,
      updated_fields: updatedFields,
      ...metadata
    });
  }

  async logMemberDeleted(adminId, memberName, metadata = {}) {
    return await this.log(adminId, 'admin_member_deleted', `Deleted member: ${memberName}`, {
      admin_action: true,
      member_name: memberName,
      ...metadata
    });
  }

  async logContentVerified(adminId, contentId, contentTitle, status, userId, metadata = {}) {
    return await this.log(adminId, 'admin_content_verified', `${status} content: ${contentTitle}`, {
      admin_action: true,
      content_id: contentId,
      content_title: contentTitle,
      verification_status: status,
      content_owner_id: userId,
      ...metadata
    });
  }

  // Dashboard activities
  async logDashboardAccess(userId, dashboardType = 'user', metadata = {}) {
    return await this.log(userId, 'dashboard_access', `Accessed ${dashboardType} dashboard`, {
      dashboard_type: dashboardType,
      ...metadata
    });
  }

  async logPageView(userId, pageName, metadata = {}) {
    return await this.log(userId, 'page_view', `Viewed page: ${pageName}`, {
      page_name: pageName,
      referrer: metadata.referrer,
      ...metadata
    });
  }

  // System activities
  async logSystemEvent(eventType, description, metadata = {}) {
    return await this.log(null, `system_${eventType}`, description, {
      system_event: true,
      ...metadata
    });
  }

  async logError(userId, errorType, errorMessage, metadata = {}) {
    return await this.log(userId, 'error', `${errorType}: ${errorMessage}`, {
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: metadata.stackTrace,
      ...metadata
    });
  }
}

// Activity Log Manager for admin dashboard
export class ActivityLogManager {
  // Get activity logs with filters
  static async getLogs(filters = {}) {
    try {
      let query = supabase
        .from('user_activity_logs')
        .select(`
          id, action_type, action_description, ip_address,
          user_agent, session_id, metadata, created_at,
          users:user_id (id, name, email, profile_image_url, enrollment_number)
        `);

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.actionType && filters.actionType !== 'all') {
        query = query.eq('action_type', filters.actionType);
      }

      if (filters.userSearch) {
        // This would need to be handled differently in a real app
        // For now, we'll fetch and filter client-side
      }

      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      if (filters.sessionId) {
        query = query.eq('session_id', filters.sessionId);
      }

      // Pagination
      if (filters.page && filters.limit) {
        const offset = (filters.page - 1) * filters.limit;
        query = query.range(offset, offset + filters.limit - 1);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .limit(filters.limit || 50);

      if (error) {
        return { data: null, error };
      }

      // Client-side filtering for user search if needed
      let filteredData = data;
      if (filters.userSearch) {
        const searchTerm = filters.userSearch.toLowerCase();
        filteredData = data.filter(log => 
          log.users?.name?.toLowerCase().includes(searchTerm) ||
          log.users?.email?.toLowerCase().includes(searchTerm)
        );
      }

      return { 
        data: filteredData, 
        error: null,
        count: count || filteredData.length 
      };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get activity statistics
  static async getActivityStats(days = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('action_type, created_at, user_id')
        .gte('created_at', startDate);

      if (error) {
        return { data: null, error };
      }

      // Process statistics
      const stats = {
        totalActivities: data.length,
        uniqueUsers: new Set(data.filter(log => log.user_id).map(log => log.user_id)).size,
        activityByType: {},
        activityByDay: {},
        mostActiveUsers: {}
      };

      // Count by action type
      data.forEach(log => {
        stats.activityByType[log.action_type] = (stats.activityByType[log.action_type] || 0) + 1;
        
        // Count by day
        const day = log.created_at.split('T')[0];
        stats.activityByDay[day] = (stats.activityByDay[day] || 0) + 1;
        
        // Count by user
        if (log.user_id) {
          stats.mostActiveUsers[log.user_id] = (stats.mostActiveUsers[log.user_id] || 0) + 1;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Get user session details
  static async getUserSessions(userId, days = 7) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('session_id, action_type, created_at, user_agent, ip_address')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error };
      }

      // Group by session
      const sessions = {};
      data.forEach(log => {
        if (!sessions[log.session_id]) {
          sessions[log.session_id] = {
            sessionId: log.session_id,
            startTime: log.created_at,
            endTime: log.created_at,
            activities: [],
            userAgent: log.user_agent,
            ipAddress: log.ip_address,
            duration: 0
          };
        }

        sessions[log.session_id].activities.push(log);
        
        // Update end time if this activity is more recent
        if (new Date(log.created_at) > new Date(sessions[log.session_id].endTime)) {
          sessions[log.session_id].endTime = log.created_at;
        }
        
        // Update start time if this activity is earlier
        if (new Date(log.created_at) < new Date(sessions[log.session_id].startTime)) {
          sessions[log.session_id].startTime = log.created_at;
        }
      });

      // Calculate session durations
      Object.keys(sessions).forEach(sessionId => {
        const session = sessions[sessionId];
        const start = new Date(session.startTime);
        const end = new Date(session.endTime);
        session.duration = Math.round((end - start) / 1000 / 60); // Duration in minutes
        session.activityCount = session.activities.length;
      });

      return { data: Object.values(sessions), error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Clean old logs (admin function)
  static async cleanOldLogs(daysToKeep = 90) {
    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('user_activity_logs')
        .delete()
        .lt('created_at', cutoffDate);

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const activityLogger = new ActivityLogger();

// Utility functions
export const getDeviceInfo = (userAgent) => {
  if (!userAgent) return 'Unknown Device';
  
  if (userAgent.includes('Mobile')) return 'Mobile Device';
  if (userAgent.includes('Tablet')) return 'Tablet';
  if (userAgent.includes('Windows')) return 'Windows PC';
  if (userAgent.includes('Mac')) return 'Mac';
  if (userAgent.includes('Linux')) return 'Linux PC';
  
  return 'Unknown Device';
};

export const getBrowserInfo = (userAgent) => {
  if (!userAgent) return 'Unknown Browser';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown Browser';
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export default { ActivityLogger, ActivityLogManager, activityLogger };
