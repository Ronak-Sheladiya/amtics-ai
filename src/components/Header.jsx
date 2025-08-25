import React from 'react';

export const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <div className="logo-container">
              <img
                src="/logo.png"
                alt="AMTICS Media Logo"
                className="brand-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <h1 className="brand-title">
              <span className="brand-text"><strong>AMTICS Media</strong></span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
