'use client';

import React, { useState } from 'react';
import { Menu, X, Database, Globe, ChevronDown, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext, NETWORK_CONFIG, Network } from './AppContext';

export default function Header() {
  const { 
    theme, 
    isMobileMenuOpen, 
    setMobileMenuOpen, 
    customRpcUrl, 
    setCustomRpcUrl,
    activeNetwork,
    setActiveNetwork
  } = useAppContext();
  const [rpcInputOpen, setRpcInputOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-50 px-4 md:px-6 h-[52px] flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -ml-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="shrink-0 relative w-7 h-7 block">
          <Image 
            src={theme === 'dark' ? '/media/SyntaxWhite.png' : '/media/SyntaxBlack.png'} 
            alt="Hand of Naire" 
            fill
            sizes="28px"
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center gap-3 font-sans">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div 
              className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-2 py-1 gap-1.5 h-7 cursor-pointer hover:border-teal-500/50 transition-colors w-32 md:w-36 justify-between"
              onClick={() => setNetworkDropdownOpen(!networkDropdownOpen)}
            >
              <div className="flex items-center gap-1.5 overflow-hidden">
                <Globe size={12} className="text-teal-500 shrink-0" />
                <span className="text-xs text-[var(--text-primary)] select-none truncate">
                  {NETWORK_CONFIG[activeNetwork]?.name || 'Select Network'}
                </span>
              </div>
              <ChevronDown size={12} className="text-[var(--text-secondary)] shrink-0" />
            </div>

            {networkDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNetworkDropdownOpen(false)}
                />
                <div className="absolute top-full right-0 md:left-0 mt-1 w-36 md:w-40 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] shadow-lg z-50 overflow-hidden flex flex-col py-1">
                  {(Object.keys(NETWORK_CONFIG) as Network[]).map((key) => (
                    <div
                      key={key}
                      onClick={() => {
                        setActiveNetwork(key);
                        setNetworkDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between hover:bg-[var(--bg-surface)] transition-colors ${activeNetwork === key ? 'text-teal-500 font-bold' : 'text-[var(--text-primary)]'}`}
                    >
                      {NETWORK_CONFIG[key].name}
                      {activeNetwork === key && <Check size={12} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        
          {rpcInputOpen && (
            <input
              type="text"
              placeholder="https://eth-mainnet..."
              className="text-xs bg-[var(--bg-main)] border border-[var(--border-color)] px-2 py-1 rounded-[1px] w-32 md:w-48 text-[var(--text-primary)] outline-none focus:border-teal-500 h-7"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              autoFocus
            />
          )}
          <button
            onClick={() => setRpcInputOpen(!rpcInputOpen)}
            className={`p-1.5 rounded-[1px] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:text-teal-500 cursor-pointer h-7 flex items-center justify-center ${rpcInputOpen || customRpcUrl ? 'text-teal-500' : 'text-[var(--text-primary)]'}`}
            title="Set Custom RPC"
          >
            <Database size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
