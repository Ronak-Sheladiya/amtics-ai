import { supabase } from '../config/supabase.js';

// Admin Setup Utilities
export const adminSetup = {
  // Create admin user in Supabase Auth (requires admin privileges)
  createAdminUser: async (email, password, userData = {}) => {
    try {
      // This would typically be done through Supabase dashboard
      // But we can provide a helper for programmatic creation
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          name: userData.name || 'Administrator',
          role: 'admin',
          enrollment_number: userData.enrollment_number || '202203103510221'
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update existing user to admin role
  makeUserAdmin: async (userId, userData = {}) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          role: 'admin',
          name: userData.name || 'Administrator',
          enrollment_number: userData.enrollment_number || '202203103510221',
          position: userData.position || 'Administrator',
          user_role: userData.user_role || 'Admin',
          bio: userData.bio || 'System Administrator',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user by email to admin role
  makeUserAdminByEmail: async (email, userData = {}) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          role: 'admin',
          name: userData.name || 'Administrator',
          enrollment_number: userData.enrollment_number || '202203103510221',
          position: userData.position || 'Administrator',
          user_role: userData.user_role || 'Admin',
          bio: userData.bio || 'System Administrator',
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check if admin user exists
  checkAdminExists: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        return { exists: false, error: error.message };
      }

      return { exists: data && data.length > 0, data: data?.[0] };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  },

  // Setup default admin with predefined data
  setupDefaultAdmin: async (email) => {
    const defaultAdminData = {
      name: 'Ronak Sheladiya',
      enrollment_number: '202203103510221',
      position: 'Vice-Chair',
      user_role: 'Graphic Designer',
      bio: 'Administrator and lead graphic designer at AMTICS Media'
    };

    return await adminSetup.makeUserAdminByEmail(email, defaultAdminData);
  },

  // Get setup instructions
  getSetupInstructions: () => {
    return {
      steps: [
        {
          title: 'Run Database Setup',
          description: 'Execute the supabase-setup.sql script in your Supabase SQL Editor',
          code: 'Copy and paste the entire supabase-setup.sql file content'
        },
        {
          title: 'Create Admin User',
          description: 'Create a user in Supabase Authentication panel',
          instructions: [
            'Go to Authentication → Users in Supabase dashboard',
            'Click "Add User"',
            'Enter email and password',
            'Save the user'
          ]
        },
        {
          title: 'Make User Admin',
          description: 'Update the user role to admin',
          code: `UPDATE public.users 
SET role = 'admin', 
    name = 'Ronak Sheladiya',
    enrollment_number = '202203103510221',
    position = 'Vice-Chair',
    user_role = 'Graphic Designer'
WHERE email = 'your-email@example.com';`
        },
        {
          title: 'Test Login',
          description: 'Try logging in with your admin credentials',
          url: '/login'
        }
      ]
    };
  }
};

// Database verification utilities
export const dbVerification = {
  // Check if all required tables exist
  checkTables: async () => {
    const requiredTables = ['users', 'user_content', 'user_activity_logs', 'dashboard_analytics'];
    const results = {};

    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        results[table] = {
          exists: !error,
          error: error?.message
        };
      } catch (error) {
        results[table] = {
          exists: false,
          error: error.message
        };
      }
    }

    return results;
  },

  // Check RLS policies
  checkPolicies: async () => {
    try {
      // Test if we can access the users table (should work with RLS)
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      return {
        rls_working: !error,
        error: error?.message
      };
    } catch (error) {
      return {
        rls_working: false,
        error: error.message
      };
    }
  },

  // Check if functions exist
  checkFunctions: async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_stats');
      
      return {
        functions_working: !error,
        data,
        error: error?.message
      };
    } catch (error) {
      return {
        functions_working: false,
        error: error.message
      };
    }
  },

  // Run complete verification
  runCompleteCheck: async () => {
    const results = {
      timestamp: new Date().toISOString(),
      tables: await dbVerification.checkTables(),
      policies: await dbVerification.checkPolicies(),
      functions: await dbVerification.checkFunctions(),
      admin_user: await adminSetup.checkAdminExists()
    };

    // Calculate overall status
    const tablesOk = Object.values(results.tables).every(t => t.exists);
    const policiesOk = results.policies.rls_working;
    const functionsOk = results.functions.functions_working;
    const adminExists = results.admin_user.exists;

    results.overall_status = {
      ready: tablesOk && policiesOk && functionsOk && adminExists,
      issues: {
        tables: !tablesOk,
        policies: !policiesOk,
        functions: !functionsOk,
        admin: !adminExists
      }
    };

    return results;
  }
};

export default { adminSetup, dbVerification };
