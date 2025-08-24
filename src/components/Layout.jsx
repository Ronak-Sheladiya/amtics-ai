import React, { useState } from 'react';
import { Background } from './Background';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { Footer } from './Footer';
import { InjectionModal } from './InjectionModal';

export const Layout = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [modalData, setModalData] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'developer':
        return <DeveloperPage />;
      default:
        return <HomePage onShowModal={setModalData} />;
    }
  };

  return (
    <>
      <Background />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <Header />
      <main className="main">
        {renderPage()}
      </main>
      <Footer onPageChange={setCurrentPage} />
      {modalData && (
        <InjectionModal
          {...modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
};
