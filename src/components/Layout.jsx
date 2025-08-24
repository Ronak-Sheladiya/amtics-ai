import React, { useState } from 'react';
import { Background } from './Background';
import { Navigation } from './Navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { InjectionModal } from './InjectionModal';

export const Layout = ({ children }) => {
  const [modalData, setModalData] = useState(null);

  return (
    <>
      <Background />
      <Navigation />
      <Header />
      <main className="main">
        {children}
      </main>
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
