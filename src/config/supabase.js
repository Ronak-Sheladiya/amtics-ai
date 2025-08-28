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
  // Users
  getUsers: async (filters = {}) => {
    if (isDemoMode()) {
      return await demoAuth.getUsers(filters);
    }

    let query = supabase
      .from('users')
      .select('*')
      .neq('role', 'admin');

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.role) query = query.eq('role', filters.role);
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    return await query.order('created_at', { ascending: false });
  },

  createUser: async (userData) => {
    return await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
  },

  updateUser: async (id, updates) => {
    return await supabase
      .from('users')
      .update(updates)
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

  // Analytics
  getDashboardStats: async () => {
    if (isDemoMode()) {
      return await demoAuth.getDashboardStats();
    }

    try {
      const { data, error } = await supabase.rpc('get_user_stats');
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  getRegistrationTrend: async (days = 30) => {
    const { data, error } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at');

    return { data, error };
  }
};
