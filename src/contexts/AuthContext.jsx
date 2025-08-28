import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, authHelpers, dbHelpers } from '../config/supabase';
import { demoAuth, isDemoMode } from '../utils/demoAuth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await handleUserSession(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            await handleUserSession(session.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleUserSession = async (authUser) => {
    try {
      // Get user profile from database
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        setLoading(false);
        return;
      }

      if (userProfile) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', authUser.id);

        // Log login activity
        await dbHelpers.logActivity(
          authUser.id,
          'login',
          'User logged in',
          {
            ip_address: null, // Will be populated by backend
            user_agent: navigator.userAgent
          }
        );

        setUser(userProfile);
        setIsAuthenticated(true);
      } else {
        // User not found in database, sign out
        await authHelpers.signOut();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error handling user session:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        return { success: false, error: error.message };
      }

      // Session handling is done in the auth state change listener
      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Log logout activity before signing out
      if (user) {
        await dbHelpers.logActivity(
          user.id,
          'logout',
          'User logged out'
        );
      }

      const { error } = await authHelpers.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
      }

      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await authHelpers.resetPassword(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  };

  const createUserAccount = async (userData, password) => {
    try {
      // First create the user in the database
      const { data: newUser, error: dbError } = await dbHelpers.createUser(userData);
      
      if (dbError) {
        return { success: false, error: dbError.message };
      }

      // Then create auth account
      const { data: authData, error: authError } = await authHelpers.signUp(
        userData.email,
        password,
        {
          user_id: newUser.id,
          name: userData.name
        }
      );

      if (authError) {
        // Rollback database user creation
        await dbHelpers.deleteUser(newUser.id);
        return { success: false, error: authError.message };
      }

      return { success: true, data: { user: newUser, auth: authData } };
    } catch (error) {
      console.error('Create user account error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signOut,
    updateUser,
    resetPassword,
    createUserAccount,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
