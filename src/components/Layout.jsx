import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Background } from './Background';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { InstituteInfo } from './InstituteInfo';
import { InjectionModal } from './InjectionModal';

export const Layout = ({ children }) => {
  const [modalData, setModalData] = useState(null);
  const location = useLocation();

  // Pages that should not show the header
  const pagesWithoutHeader = ['/about', '/team'];
  const isCardPage = location.pathname.startsWith('/card/');
  const shouldShowHeader = !pagesWithoutHeader.includes(location.pathname) && !isCardPage;

  return (
    <>
      <Background />
      <Navigation />
      {shouldShowHeader && <Header />}
      <main className="main">
        {children}
      </main>
      <InstituteInfo />
      <Footer />
      {modalData && (
        <InjectionModal
          {...modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </>
  );
};
