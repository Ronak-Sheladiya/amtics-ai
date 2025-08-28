// Demo Authentication Utilities
// This provides a mock authentication system for demonstration purposes

export const DEMO_USERS = {
  'admin@amtics.com': {
    id: 'demo-admin-1',
    email: 'admin@amtics.com',
    password: 'admin123',
    name: 'Ronak Sheladiya',
    enrollment_number: '202203103510221',
    position: 'Vice-Chair',
    role: 'admin',
    user_role: 'Graphic Designer',
    status: 'active',
    profile_image_url: null,
    bio: 'Administrator and Graphic Designer at AMTICS Media',
    is_first_login: false,
    is_onboarded: true,
    created_at: '2024-01-15T10:00:00Z',
    last_login: new Date().toISOString()
  },
  'moderator@amtics.com': {
    id: 'demo-mod-1',
    email: 'moderator@amtics.com',
    password: 'mod123',
    name: 'Sarah Johnson',
    enrollment_number: '202203103510222',
    position: 'Secretary',
    role: 'moderator',
    user_role: 'Content Manager',
    status: 'active',
    profile_image_url: null,
    bio: 'Content moderator and manager',
    is_first_login: false,
    is_onboarded: true,
    created_at: '2024-01-20T10:00:00Z',
    last_login: new Date().toISOString()
  },
  'member@amtics.com': {
    id: 'demo-member-1',
    email: 'member@amtics.com',
    password: 'member123',
    name: 'John Smith',
    enrollment_number: '202203103510223',
    position: 'Member',
    role: 'member',
    user_role: 'Web Developer',
    status: 'active',
    profile_image_url: null,
    bio: 'Web developer and team member',
    is_first_login: false,
    is_onboarded: true,
    created_at: '2024-02-01T10:00:00Z',
    last_login: new Date().toISOString()
  }
};

export const DEMO_MEMBERS = [
  {
    id: 'demo-member-2',
    name: 'Emily Rodriguez',
    enrollment_number: '202203103510224',
    email: 'emily@amtics.com',
    position: 'Vice-President',
    role: 'moderator',
    user_role: 'UI/UX Designer',
    status: 'active',
    profile_image_url: '/member-images/emily-rodriguez.svg',
    bio: 'Passionate about creating user-centered designs',
    created_at: '2024-01-25T10:00:00Z',
    last_login: '2024-03-15T14:30:00Z'
  },
  {
    id: 'demo-member-3',
    name: 'Mike Chen',
    enrollment_number: '202203103510225',
    email: 'mike@amtics.com',
    position: 'Coordinator',
    role: 'member',
    user_role: 'Mobile Developer',
    status: 'active',
    profile_image_url: '/member-images/mike-chen.svg',
    bio: 'Mobile app development specialist',
    created_at: '2024-02-10T10:00:00Z',
    last_login: '2024-03-14T09:15:00Z'
  },
  {
    id: 'demo-member-4',
    name: 'Alex Johnson',
    enrollment_number: '202203103510226',
    email: 'alex@amtics.com',
    position: 'Member',
    role: 'member',
    user_role: 'Data Analyst',
    status: 'retired',
    profile_image_url: null,
    bio: 'Former team member, now working in industry',
    created_at: '2023-09-01T10:00:00Z',
    last_login: '2024-01-20T16:45:00Z'
  }
];

export const DEMO_CONTENT = [
  {
    id: 'demo-content-1',
    user_id: 'demo-member-1',
    content_type: 'image',
    title: 'Team Event Photography',
    description: 'Photos from our recent team building event',
    file_url: '/demo-content/team-event.jpg',
    thumbnail_url: '/demo-content/team-event-thumb.jpg',
    file_size: 2048576,
    mime_type: 'image/jpeg',
    verification_status: 'pending',
    uploaded_at: '2024-03-10T10:00:00Z',
    users: DEMO_USERS['member@amtics.com']
  },
  {
    id: 'demo-content-2',
    user_id: 'demo-member-2',
    content_type: 'document',
    title: 'Project Proposal Document',
    description: 'Detailed proposal for upcoming project',
    file_url: '/demo-content/proposal.pdf',
    file_size: 1024000,
    mime_type: 'application/pdf',
    verification_status: 'verified',
    verified_by: 'demo-admin-1',
    verified_at: '2024-03-12T15:30:00Z',
    uploaded_at: '2024-03-08T14:00:00Z',
    users: { name: 'Emily Rodriguez', email: 'emily@amtics.com', enrollment_number: '202203103510224' }
  }
];

export const DEMO_ACTIVITY_LOGS = [
  {
    id: 'demo-log-1',
    user_id: 'demo-admin-1',
    action_type: 'login',
    action_description: 'Admin logged into dashboard',
    ip_address: '192.168.1.100',
    user_agent: navigator.userAgent,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    users: DEMO_USERS['admin@amtics.com']
  },
  {
    id: 'demo-log-2',
    user_id: 'demo-member-1',
    action_type: 'content_upload',
    action_description: 'Uploaded team event photos',
    ip_address: '192.168.1.101',
    user_agent: navigator.userAgent,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    users: DEMO_USERS['member@amtics.com']
  },
  {
    id: 'demo-log-3',
    user_id: 'demo-admin-1',
    action_type: 'content_verified',
    action_description: 'Verified Emily\'s project proposal',
    ip_address: '192.168.1.100',
    user_agent: navigator.userAgent,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    users: DEMO_USERS['admin@amtics.com']
  },
  {
    id: 'demo-log-4',
    user_id: 'demo-member-2',
    action_type: 'profile_update',
    action_description: 'Updated profile information',
    ip_address: '192.168.1.102',
    user_agent: navigator.userAgent,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    users: { name: 'Emily Rodriguez', email: 'emily@amtics.com', profile_image_url: '/member-images/emily-rodriguez.svg' }
  }
];

export const demoAuth = {
  signIn: async (email, password) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = DEMO_USERS[email];
    if (user && user.password === password) {
      // Store in localStorage for persistence
      localStorage.setItem('demo_user', JSON.stringify({
        ...user,
        last_login: new Date().toISOString()
      }));
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  },

  signOut: async () => {
    localStorage.removeItem('demo_user');
    return { success: true };
  },

  getCurrentUser: async () => {
    const stored = localStorage.getItem('demo_user');
    if (stored) {
      return { user: JSON.parse(stored), error: null };
    }
    return { user: null, error: null };
  },

  // Mock database operations
  getUsers: async (filters = {}) => {
    let users = [...DEMO_MEMBERS];
    
    if (filters.status && filters.status !== 'all') {
      users = users.filter(u => u.status === filters.status);
    }
    
    if (filters.role && filters.role !== 'all') {
      users = users.filter(u => u.role === filters.role);
    }
    
    if (filters.search) {
      users = users.filter(u => 
        u.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        u.enrollment_number.includes(filters.search)
      );
    }
    
    return { data: users, error: null };
  },

  getContent: async (filters = {}) => {
    let content = [...DEMO_CONTENT];
    
    if (filters.status && filters.status !== 'all') {
      content = content.filter(c => c.verification_status === filters.status);
    }
    
    if (filters.type && filters.type !== 'all') {
      content = content.filter(c => c.content_type === filters.type);
    }
    
    return { data: content, error: null };
  },

  getActivityLogs: async (filters = {}) => {
    let logs = [...DEMO_ACTIVITY_LOGS];
    
    if (filters.action && filters.action !== 'all') {
      logs = logs.filter(l => l.action_type === filters.action);
    }
    
    if (filters.limit) {
      logs = logs.slice(0, filters.limit);
    }
    
    return { data: logs, error: null };
  },

  getDashboardStats: async () => {
    return {
      data: {
        total_members: DEMO_MEMBERS.length,
        active_members: DEMO_MEMBERS.filter(m => m.status === 'active').length,
        new_this_month: 2,
        pending_content: DEMO_CONTENT.filter(c => c.verification_status === 'pending').length
      },
      error: null
    };
  },

  logActivity: async (userId, actionType, description, metadata = {}) => {
    // Mock logging - in demo mode, we just console.log
    console.log('Demo Activity:', { userId, actionType, description, metadata });
    return { success: true };
  }
};

// Check if we should use demo mode
export const isDemoMode = () => {
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !supabaseKey || supabaseKey === 'replace_with_your_supabase_anon_key';
};
