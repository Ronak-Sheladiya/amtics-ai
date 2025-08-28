import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { OurTeamPage } from './components/pages/OurTeamPage';
import { IdCardPage } from './components/pages/IdCardPage';
import { DeveloperPage } from './components/pages/DeveloperPage';
import { LoginPage } from './components/pages/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProtectedRoute, AdminRoute, GuestRoute, RoleRedirect } from './components/ProtectedRoute';
import { ToastContainer } from './components/ToastContainer';
import { AdminNavHelper } from './components/AdminNavHelper';
import './App.css';
import './styles/admin.css';
import './styles/nav-helper.css';

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <ScrollToTop />
            <AdminNavHelper />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/about" element={<Layout><AboutPage /></Layout>} />
              <Route path="/team" element={<Layout><OurTeamPage /></Layout>} />
              <Route path="/developer" element={<Layout><DeveloperPage /></Layout>} />
              <Route path="/card/:id" element={<Layout><IdCardPage /></Layout>} />

              {/* Authentication Routes */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />

              {/* Dashboard Redirect */}
              <Route
                path="/dashboard"
                element={<RoleRedirect />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
