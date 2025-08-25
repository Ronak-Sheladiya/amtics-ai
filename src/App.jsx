import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { OurTeamPage } from './components/pages/OurTeamPage';
import { IdCardPage } from './components/pages/IdCardPage';
import { DeveloperPage } from './components/pages/DeveloperPage';
import { ToastContainer } from './components/ToastContainer';
import './App.css';

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
      <Router>
        <div className="app">
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/team" element={<OurTeamPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/card/:id" element={<IdCardPage />} />
            </Routes>
          </Layout>
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
