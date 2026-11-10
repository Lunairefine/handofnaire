'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from './AppContext';

export default function Header() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppContext();

  return (
    <header className="fixed top-0 bg-[var(--bg-main)]/90 backdrop-blur-md border-b border-[var(--border-color)] z-50 px-3 sm:px-4 md:px-6 h-[52px] flex justify-between items-center w-full gap-3">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -ml-2"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link href="/" className="shrink-0 relative w-9 h-9 block">
          <Image 
            src="/media/SyntaxWhite.png"
            alt="Hand of Naire" 
            fill
            sizes="36px"
            className="object-contain"
          />
        </Link>
      </div>

    </header>
  );
}
