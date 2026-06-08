'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from './AppContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext();

  return (
    <div className={`flex flex-col min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] transition-all duration-300 overflow-x-hidden pt-[52px] ${theme}`}>
      <Header />
      <div className="flex flex-1 relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 p-4 md:p-6 grid-bg overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}