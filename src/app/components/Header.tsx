'use client';

import React from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppContext } from './AppContext';

export default function Header() {
  const { isScanning, toggleScanning, theme, toggleTheme, isMobileMenuOpen, setMobileMenuOpen } = useAppContext();
  const pathname = usePathname();

  const showScannerControls = pathname.includes('erc721scanner') || pathname.includes('erc20scanner');

  return (
    <header className="sticky top-0 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)] z-50 px-6 h-[52px] flex justify-between items-center w-full">
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
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] leading-none uppercase tracking-wider font-sans m-0">
            Hand of Naire
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 font-sans">
        {showScannerControls && (
          <button
            onClick={toggleScanning}
            className={`text-[10px] font-extrabold px-3 py-1.5 rounded-[1px] border cursor-pointer transition-all ${
              isScanning
                ? 'border-rose-500/20 bg-rose-500/5 text-rose-500'
                : 'border-teal-500/20 bg-teal-500/5 text-teal-500'
            }`}
          >
            {isScanning ? 'Pause Engine' : 'Resume Engine'}
          </button>
        )}

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
