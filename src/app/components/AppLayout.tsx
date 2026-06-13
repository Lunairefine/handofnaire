'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from './AppContext';
import TopoBackground from './TopoBackground';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useAppContext();

  return (
    <div className={`flex flex-col min-h-screen text-[var(--text-primary)] transition-all duration-300 overflow-x-hidden pt-[52px] relative ${theme}`}>
      <TopoBackground />
      <Header />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}