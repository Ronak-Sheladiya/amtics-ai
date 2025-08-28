import { createClient } from '@supabase/supabase-js';
import { demoAuth, isDemoMode } from '../utils/demoAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rtugujirmkcwdmdiwzow.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helper functions
export const authHelpers = {
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  }
};

// Database helper functions
export const dbHelpers = {
  // Users Management
  getUsers: async (filters = {}) => {
    if (isDemoMode()) {
      return await demoAuth.getUsers(filters);
    }

    let query = supabase
      .from('users')
      .select(`
        id, name, enrollment_number, email, position, role,
        user_role, status, profile_image_url, last_login,
        created_at, created_by, bio, is_first_login, is_onboarded
      `);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,enrollment_number.ilike.%${filters.search}%`);
    }
    if (filters.excludeAdmins) {
      query = query.neq('role', 'admin');
    }

    // Pagination
    if (filters.page && filters.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query = query.range(offset, offset + filters.limit - 1);
    }

    return await query.order('created_at', { ascending: false });
  },

  getUserById: async (id) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
  },

  getUserByEmail: async (email) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
  },

  createUser: async (userData) => {
    // Add created timestamp
    const userWithTimestamp = {
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await supabase
      .from('users')
      .insert(userWithTimestamp)
      .select()
      .single();
  },

  updateUser: async (id, updates) => {
    // Add updated timestamp
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    return await supabase
      .from('users')
      .update(updatesWithTimestamp)
      .eq('id', id)
      .select()
      .single();
  },

  updateUserStatus: async (id, status) => {
    return await supabase
      .from('users')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  },

  deleteUser: async (id) => {
    return await supabase
      .from('users')
      .delete()
      .eq('id', id);
  },

  updateLastLogin: async (id) => {
    return await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  },

  // User count and statistics
  getUserCounts: async () => {
    const { data, error } = await supabase.rpc('get_user_stats');
    return { data: data?.[0], error };
  },

  // Content
  getContent: async (filters = {}) => {
    if (isDemoMode()) {
      return await demoAuth.getContent(filters);
    }

    let query = supabase
      .from('user_content')
      .select(`
        *,
        users:user_id (name, email, enrollment_number)
      `);

    if (filters.status) query = query.eq('verification_status', filters.status);
    if (filters.type) query = query.eq('content_type', filters.type);

    return await query.order('uploaded_at', { ascending: false });
  },

  verifyContent: async (id, status, notes, verifiedBy) => {
    return await supabase
      .from('user_content')
      .update({
        verification_status: status,
        verification_notes: notes,
        verified_by: verifiedBy,
        verified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  },

  // Activity Logs
  getActivityLogs: async (filters = {}) => {
    if (isDemoMode()) {
      return await demoAuth.getActivityLogs(filters);
    }

    let query = supabase
      .from('user_activity_logs')
      .select(`
        *,
        users:user_id (name, email, profile_image_url)
      `);

    if (filters.user) {
      query = query.or(`users.name.ilike.%${filters.user}%,users.email.ilike.%${filters.user}%`);
    }
    if (filters.action) query = query.eq('action_type', filters.action);
    if (filters.dateFrom) query = query.gte('created_at', filters.dateFrom);
    if (filters.dateTo) query = query.lte('created_at', filters.dateTo);

    return await query
      .order('created_at', { ascending: false })
      .limit(filters.limit || 50);
  },

  logActivity: async (userId, actionType, description, metadata = {}) => {
    if (isDemoMode()) {
      return await demoAuth.logActivity(userId, actionType, description, metadata);
    }

    return await supabase
      .from('user_activity_logs')
      .insert({
        user_id: userId,
        action_type: actionType,
        action_description: description,
        metadata,
        ip_address: metadata.ip_address,
        user_agent: metadata.user_agent
      });
  },

  // Analytics and Dashboard Stats
  getDashboardStats: async () => {
    if (isDemoMode()) {
      return await demoAuth.getDashboardStats();
    }

    try {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (error) throw error;
      return { data: data?.[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getRegistrationTrend: async (days = 30) => {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate)
      .neq('role', 'admin')
      .order('created_at');

    return { data, error };
  },

  getContentStats: async () => {
    const { data, error } = await supabase
      .from('user_content')
      .select('verification_status, content_type, uploaded_at')
      .gte('uploaded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    return { data, error };
  },

  getRecentActivity: async (limit = 10) => {
    return await supabase
      .from('user_activity_logs')
      .select(`
        id, action_type, action_description, created_at,
        users:user_id (name, email, profile_image_url)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
  }
};

// Storage helper functions
export const storageHelpers = {
  uploadProfileImage: async (userId, file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) return { data: null, error };

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    return { data: { path: data.path, url: publicUrl }, error: null };
  },

  uploadUserContent: async (userId, file, contentType = 'portfolio') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('user-portfolios')
      .upload(fileName, file);

    if (error) return { data: null, error };

    // Get signed URL for private bucket
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('user-portfolios')
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    if (urlError) return { data: null, error: urlError };

    return {
      data: {
        path: data.path,
        url: signedUrlData.signedUrl,
        file_size: file.size,
        mime_type: file.type
      },
      error: null
    };
  },

  deleteFile: async (bucket, filePath) => {
    return await supabase.storage
      .from(bucket)
      .remove([filePath]);
  }
};

// Utility functions
export const utilityHelpers = {
  generateSecurePassword: (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTime: (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};
