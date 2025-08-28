import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Shield, Home, Info } from 'lucide-react';
import { isDemoMode } from '../utils/demoAuth';

export const AdminNavHelper = () => {
  const { isAuthenticated, user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="admin-nav-helper">
      <div className="nav-helper-content">
        {isDemoMode() && (
          <div className="demo-indicator">
            <Info size={14} />
            <span>Demo Mode</span>
          </div>
        )}
        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home size={16} />
            Home
          </Link>

          {!isAuthenticated ? (
            <Link to="/login" className="nav-link login-link">
              <LogIn size={16} />
              Admin Login
            </Link>
          ) : (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link admin-link">
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              )}
              <button onClick={handleSignOut} className="nav-link logout-btn">
                <LogIn size={16} />
                Logout ({user?.name})
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
