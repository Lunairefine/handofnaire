'use client';

import { useState } from 'react';
import { Check, ChevronDown, Database } from 'lucide-react';
import { useAppContext } from './AppContext';
import { NETWORK_CONFIG, type Network } from '@/services/networkConfig';

export default function NetworkSelector() {
  const { activeNetwork, setActiveNetwork, customRpcUrl, setCustomRpcUrl } = useAppContext();
  const [rpcInputOpen, setRpcInputOpen] = useState(false);
  const [networkDropdownOpen, setNetworkDropdownOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 font-sans">
      <div className="relative">
        <button
          type="button"
          className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-2 py-1 gap-1.5 h-8 w-40 justify-between hover:text-[var(--text-primary)] transition-colors"
          onClick={() => setNetworkDropdownOpen((open) => !open)}
        >
          <span className="text-xs text-[var(--text-primary)] truncate">
            {NETWORK_CONFIG[activeNetwork]?.name || 'Select Network'}
          </span>
          <ChevronDown size={12} className="text-[var(--text-secondary)] shrink-0" />
        </button>

        {networkDropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNetworkDropdownOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] shadow-lg z-50 overflow-hidden flex flex-col py-1">
              {(Object.keys(NETWORK_CONFIG) as Network[]).map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setActiveNetwork(key);
                    setNetworkDropdownOpen(false);
                  }}
                  className={`px-3 py-2 text-xs text-left cursor-pointer flex items-center justify-between transition-colors ${activeNetwork === key ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {NETWORK_CONFIG[key].name}
                  {activeNetwork === key && <Check size={12} />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {rpcInputOpen && (
        <input
          type="text"
          placeholder="https://eth-mainnet..."
          className="text-xs bg-[var(--bg-main)] border border-[var(--border-color)] px-2 py-1 rounded-[1px] w-56 text-[var(--text-primary)] outline-none focus:border-[var(--text-primary)] h-8"
          value={customRpcUrl}
          onChange={(event) => setCustomRpcUrl(event.target.value)}
          autoFocus
        />
      )}

      <button
        type="button"
        onClick={() => setRpcInputOpen((open) => !open)}
        className={`p-1.5 rounded-[1px] border border-[var(--border-color)] bg-[var(--bg-surface)] hover:text-[var(--text-primary)] cursor-pointer h-8 w-8 shrink-0 flex items-center justify-center ${rpcInputOpen || customRpcUrl ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
        title="Set Custom RPC"
      >
        <Database size={14} />
      </button>
    </div>
  );
}
