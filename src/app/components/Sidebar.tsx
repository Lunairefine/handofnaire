import React, { useEffect } from 'react';
import { PieChart, Key, Wallet, Send, Activity, Images, Coins, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from './AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen, isDesktopCollapsed, setDesktopCollapsed } = useAppContext();

  const isActive = (path: string) => pathname.includes(path);
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

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
        className={`fixed inset-y-0 left-0 top-[52px] ${isDesktopCollapsed ? 'w-16' : 'w-64'} bg-[var(--bg-main)] border-r border-[var(--border-color)] flex flex-col z-40 transform transition-all duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 min-h-0 p-3 sm:p-4 space-y-1.5 overflow-y-auto no-scrollbar pt-5">
          <div>
            {!isDesktopCollapsed && (
              <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-2 font-sans">
                Integrations
              </p>
            )}
            {[
              { id: 'portfolio', name: 'Portfolio', icon: PieChart },
              { id: 'walletgenerator', name: 'Wallet Generator', icon: Key },
              { id: 'balancechecker', name: 'Balance Checker', icon: Wallet },
              { id: 'multisender', name: 'Multisender', icon: Send },
              { id: 'nairerpc', name: 'RPC Scanner', icon: Activity },
            ].map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                onClick={handleNavClick}
                className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-[1px] border text-[14px] font-sans font-semibold text-left transition-colors ${isActive(item.id) ? 'border-transparent text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <item.icon size={16} className="shrink-0" />
                {!isDesktopCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          <div className="pt-4">
            {!isDesktopCollapsed && (
              <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider px-3 mb-2 font-sans">
                Active Module
              </p>
            )}
            <div className="space-y-1.5">
              <Link 
                href="/erc721"
                onClick={handleNavClick}
                className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-[1px] border text-[14px] font-sans font-semibold text-left transition-colors ${isActive('erc721') ? 'border-transparent text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Images size={16} className="shrink-0" />
                {!isDesktopCollapsed && <span>ERC721</span>}
              </Link>
              <Link 
                href="/erc20"
                onClick={handleNavClick}
                className={`w-full flex items-center ${isDesktopCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-[1px] border text-[14px] font-sans font-semibold text-left transition-colors ${isActive('erc20') ? 'border-transparent text-[var(--text-primary)]' : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              >
                <Coins size={16} className="shrink-0" />
                {!isDesktopCollapsed && <span>ERC20</span>}
              </Link>
            </div>
          </div>
        </nav>

        <div className={`shrink-0 p-3 sm:p-4 flex ${isDesktopCollapsed ? 'justify-center' : 'justify-between'} items-center mt-auto`}>
          <button
            onClick={() => setDesktopCollapsed(!isDesktopCollapsed)}
            className="p-1.5 rounded-[1px] cursor-pointer text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors hidden md:block"
            aria-label="Toggle Sidebar"
          >
            {isDesktopCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>
      </aside>
    </>
  );
}
