'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NETWORK_CONFIG, type Network } from '@/services/networkConfig';

export { NETWORK_CONFIG } from '@/services/networkConfig';
export type { Network } from '@/services/networkConfig';

interface AppContextType {
  isScanning: boolean;
  toggleScanning: () => void;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  isDesktopCollapsed: boolean;
  setDesktopCollapsed: (collapsed: boolean) => void;
  customRpcUrl: string;
  setCustomRpcUrl: (url: string) => void;
  activeNetwork: Network;
  setActiveNetwork: (network: Network) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isDesktopCollapsed, setDesktopCollapsed] = useState<boolean>(false);
  const [customRpcUrl, setCustomRpcUrlState] = useState<string>('');
  const [activeNetwork, setActiveNetworkState] = useState<Network>('ethereum');

  useEffect(() => {
    document.documentElement.classList.add('dark');

    const savedRpc = localStorage.getItem('customRpcUrl');
    if (savedRpc) {
      setCustomRpcUrlState(savedRpc);
    }
    
    const savedNetwork = localStorage.getItem('activeNetwork') as Network | null;
    if (savedNetwork) {
      setActiveNetworkState(savedNetwork);
    }
  }, []);

  const toggleScanning = () => setIsScanning(prev => !prev);

  const setCustomRpcUrl = (url: string) => {
    setCustomRpcUrlState(url);
    if (url) {
      localStorage.setItem('customRpcUrl', url);
    } else {
      localStorage.removeItem('customRpcUrl');
    }
  };

  const setActiveNetwork = (network: Network) => {
    setActiveNetworkState(network);
    localStorage.setItem('activeNetwork', network);
  };

  return (
    <AppContext.Provider value={{ 
      isScanning, toggleScanning, setIsScanning, 
      isMobileMenuOpen, setMobileMenuOpen,
      isDesktopCollapsed, setDesktopCollapsed,
      customRpcUrl, setCustomRpcUrl,
      activeNetwork, setActiveNetwork
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
