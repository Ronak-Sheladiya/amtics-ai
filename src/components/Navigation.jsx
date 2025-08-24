import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, Info, Users, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navigation = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/team', label: 'Our Team', icon: Users }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            <Zap className="nav-brand-icon" />
            <span className="nav-brand-text">AMTICS</span>
          </Link>

          <div className="nav-menu">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}

            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
