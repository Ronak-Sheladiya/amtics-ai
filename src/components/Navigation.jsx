import React from 'react';
import { Zap, Home, Info, Code, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Navigation = ({ currentPage, onPageChange }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="nav-brand">
            <Zap className="nav-brand-icon" />
            <span className="nav-brand-text">AMTICS</span>
          </div>
          
          <div className="nav-menu">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-link ${currentPage === id ? 'active' : ''}`}
                onClick={() => onPageChange(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
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
