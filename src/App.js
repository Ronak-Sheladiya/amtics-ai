import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Header from './components/Header';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import DeveloperPage from './components/DeveloperPage';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import InjectionModal from './components/InjectionModal';
import BackgroundElements from './components/BackgroundElements';
import { AmticsProvider } from './context/AmticsContext';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateToPage = (pageName) => {
    console.log('Navigating to page:', pageName);
    setCurrentPage(pageName);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage key="home" />;
      case 'about':
        return <AboutPage key="about" />;
      case 'developer':
        return <DeveloperPage key="developer" />;
      default:
        return <HomePage key="home" />;
    }
  };

  return (
    <AmticsProvider>
      <div className="app">
        <BackgroundElements />
        
        <Navbar currentPage={currentPage} onNavigate={navigateToPage} />
        
        <Header />
        
        <main className="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer currentPage={currentPage} onNavigate={navigateToPage} />
        
        <ToastContainer />
        <InjectionModal />
      </div>
    </AmticsProvider>
  );
}

export default App;
