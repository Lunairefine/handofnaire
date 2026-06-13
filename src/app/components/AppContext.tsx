'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isScanning: boolean;
  toggleScanning: () => void;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  customRpcUrl: string;
  setCustomRpcUrl: (url: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [customRpcUrl, setCustomRpcUrlState] = useState<string>('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedRpc = localStorage.getItem('customRpcUrl');
    if (savedRpc) {
      setCustomRpcUrlState(savedRpc);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const toggleScanning = () => setIsScanning(prev => !prev);

  const setCustomRpcUrl = (url: string) => {
    setCustomRpcUrlState(url);
    if (url) {
      localStorage.setItem('customRpcUrl', url);
    } else {
      localStorage.removeItem('customRpcUrl');
    }
  };

  return (
    <AppContext.Provider value={{ 
      theme, toggleTheme, 
      isScanning, toggleScanning, setIsScanning, 
      isMobileMenuOpen, setMobileMenuOpen,
      customRpcUrl, setCustomRpcUrl
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
}
