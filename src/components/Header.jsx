import React from 'react';

export const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <h1 className="brand-title">
              <span className="brand-text">AMTICS</span>
              <span className="brand-subtitle">Ai Graphic Designer</span>
            </h1>
            <p className="brand-description">
              Advanced AI-powered graphic design and prompt generation platform
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
