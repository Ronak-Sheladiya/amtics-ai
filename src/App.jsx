import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/ToastContainer';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Layout />
        <ToastContainer />
      </div>
    </ThemeProvider>
  );
}

export default App;
