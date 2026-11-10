import React, { useState } from 'react';
import { useAppContext } from '@/app/components/AppContext';

interface ScannerStatsProps {
  latestBlock: number;
  blocksScanned: number;
  activeMintsCount: number;
  tps: number;
  status: string;
  mode: string;
  toggleScanning: () => void;
}

export default function ScannerStats({
  latestBlock,
  blocksScanned,
  activeMintsCount,
  tps,
  status,
  mode,
  toggleScanning
}: ScannerStatsProps) {
  const { isScanning } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);

  const title = 'SCANNER DETAILS';
  const buttonText = isScanning ? 'STOP AUDIT' : 'RUN AUDIT';

  return (
    <div className="mb-5 md:mb-6 w-full bg-white/[0.03] border border-[var(--border-color)] rounded-[1px] font-sans text-sm text-[var(--text-primary)] overflow-hidden">
      {/* Header */}
      <div 
        className={`flex justify-between items-center gap-4 px-4 sm:px-6 py-4 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors ${isOpen ? 'border-b border-[var(--border-color)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-[0.16em] text-xs sm:text-sm">{title}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleScanning();
          }} 
          className={`font-mono shrink-0 text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-2 rounded-[1px] cursor-pointer transition-all uppercase tracking-wider text-white ${
            isScanning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-zinc-500 hover:bg-zinc-600'
          }`}
        >
          {buttonText}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Latest Block</span>
            <span className="text-sm font-semibold tabular-nums text-right">{latestBlock?.toLocaleString() ?? '0'}</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Active Mints</span>
            <span className="text-sm font-semibold tabular-nums text-right text-zinc-500">{activeMintsCount}</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Blocks Audited</span>
            <span className="text-sm font-semibold tabular-nums text-right">{blocksScanned?.toLocaleString() ?? '0'}</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Scan Speed</span>
            <span className="text-sm font-semibold tabular-nums text-right">{tps} tx/s</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Engine Status</span>
            <span className="flex items-baseline justify-end gap-2 text-right">
              <span className={`text-sm font-bold ${isScanning ? 'text-zinc-500' : 'text-red-500'}`}>
                {isScanning ? 'ACTIVE' : 'PAUSED'}
              </span>
              {isScanning && <span className="max-w-[140px] truncate text-[10px] text-[var(--text-secondary)]">({status})</span>}
            </span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="text-xs sm:text-sm text-[var(--text-secondary)]">Scanner Mode</span>
            <span className="text-sm font-bold text-right text-amber-500">{mode === 'ERC721' ? 'ERC721 MINT' : 'ERC20 MINT'}</span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
