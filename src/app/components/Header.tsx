'use client';

import React, { useState } from 'react';
import { Sun, Moon, Menu, X, Database } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from './AppContext';

export default function Header() {
  const { theme, toggleTheme, isMobileMenuOpen, setMobileMenuOpen, customRpcUrl, setCustomRpcUrl } = useAppContext();
  const [rpcInputOpen, setRpcInputOpen] = useState(false);

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
          {rpcInputOpen && (
            <input
              type="text"
              placeholder="https://eth-mainnet..."
              className="text-xs bg-[var(--bg-main)] border border-[var(--border-color)] px-2 py-1 rounded-[1px] w-32 md:w-48 text-[var(--text-primary)] outline-none focus:border-teal-500"
              value={customRpcUrl}
              onChange={(e) => setCustomRpcUrl(e.target.value)}
              autoFocus
            />
          )}
          <button
            onClick={() => setRpcInputOpen(!rpcInputOpen)}
            className={`p-1.5 rounded-[1px] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:text-teal-500 cursor-pointer ${rpcInputOpen || customRpcUrl ? 'text-teal-500' : 'text-[var(--text-primary)]'}`}
            title="Set Custom RPC"
          >
            <Database size={14} />
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-[1px] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:text-teal-500 cursor-pointer text-[var(--text-primary)]"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
}

