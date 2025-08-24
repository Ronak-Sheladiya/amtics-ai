import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="brand">
            <motion.h1 
              className="brand-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="brand-text">AMTICS</span>
              <motion.span 
                className="brand-subtitle"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Ai Graphic Designer
              </motion.span>
            </motion.h1>
            <motion.p 
              className="brand-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Advanced AI-powered graphic design and prompt generation platform
            </motion.p>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
