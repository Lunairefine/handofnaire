'use client';

import React, { useState } from 'react';
import { Images, Coins, FileTerminal, Binary, KeyRound, Heart, Copy, Check, Radar, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from './AppContext';

export default function Sidebar() {
  const [copiedDonation, setCopiedDonation] = useState<boolean>(false);
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useAppContext();

  const isActive = (path: string) => pathname.includes(path);
  
  const handleNavClick = () => {
    if (isMobileMenuOpen) setMobileMenuOpen(false);
  };

  return (
    <>
      {}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 top-[52px] bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {}
      <aside 
        className={`fixed inset-y-0 left-0 top-[52px] w-64 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar pt-6">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-2 font-sans">
              Integrations
            </p>
            {[
              { id: 'portfolio', name: 'Portfolio', icon: Search },
              { id: 'walletgenerator', name: 'Wallet Generator', icon: KeyRound },
              { id: 'balancechecker', name: 'Balance Checker', icon: FileTerminal },
              { id: 'multisender', name: 'Multisender', icon: Binary },
              { id: 'nairerpc', name: 'RPC Scanner', icon: Radar },
            ].map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                onClick={handleNavClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[1px] border text-sm font-sans font-semibold text-left transition-colors ${isActive(item.id) ? 'border-teal-500/20 bg-teal-500/5 text-teal-500' : 'border-transparent text-[var(--text-secondary)] hover:text-teal-500 hover:bg-[var(--bg-main)]/50'}`}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4">
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-2 font-sans">
              Active Module
            </p>
            <div className="space-y-1.5">
              <Link 
                href="/erc721scanner"
                onClick={handleNavClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[1px] border text-sm font-sans font-semibold text-left transition-colors ${isActive('erc721scanner') ? 'border-teal-500/20 bg-teal-500/5 text-teal-500' : 'border-transparent text-[var(--text-secondary)] hover:text-teal-500 hover:bg-[var(--bg-main)]/50'}`}
              >
                <Images size={16} />
                <span>ERC721 Scanner</span>
              </Link>
              <Link 
                href="/erc20scanner"
                onClick={handleNavClick}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[1px] border text-sm font-sans font-semibold text-left transition-colors ${isActive('erc20scanner') ? 'border-teal-500/20 bg-teal-500/5 text-teal-500' : 'border-transparent text-[var(--text-secondary)] hover:text-teal-500 hover:bg-[var(--bg-main)]/50'}`}
              >
                <Coins size={16} />
                <span>ERC20 Scanner</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]/50">
          <button
            onClick={() => {
              navigator.clipboard.writeText('0x9111c47492a9043d12af0e6c46d57560eebcd9d4');
              setCopiedDonation(true);
              setTimeout(() => setCopiedDonation(false), 2000);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[1px] border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-colors font-sans text-[10px] cursor-pointer"
          >
            <div className="flex items-center gap-2 font-bold">
              <Heart size={12} className="animate-pulse" />
              <span>Donate</span>
            </div>
            {copiedDonation ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        </div>
      </aside>
    </>
  );
}