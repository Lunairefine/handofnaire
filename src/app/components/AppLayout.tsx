'use client';

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from './AppContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isDesktopCollapsed } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen text-[var(--text-primary)] transition-all duration-300 overflow-x-hidden pt-[52px] relative dark">
      <Header />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isDesktopCollapsed ? 'md:pl-16' : 'md:pl-64'}`}>
          <main className="flex-1 min-w-0 overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[1600px]">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
