import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Home, Info, Code } from 'lucide-react';

const Navbar = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'developer', label: 'Developer', icon: Code }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <motion.div 
            className="nav-brand"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Zap className="nav-brand-icon" />
            <span className="nav-brand-text">AMTICS</span>
          </motion.div>
          
          <div className="nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.id);
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
