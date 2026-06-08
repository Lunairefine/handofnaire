'use client';

import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useAppContext } from './AppContext';

export default function Header() {
  const { theme, toggleTheme, isMobileMenuOpen, setMobileMenuOpen } = useAppContext();

  return (
    <header className="sticky top-0 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-50 px-4 md:px-6 h-[52px] flex justify-between items-center w-full">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -ml-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="shrink-0 relative w-7 h-7">
          <Image 
            src={theme === 'dark' ? '/media/SyntaxWhite.png' : '/media/SyntaxBlack.png'} 
            alt="Hand of Naire" 
            fill
            sizes="28px"
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 font-sans">
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
