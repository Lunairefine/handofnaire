import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="mb-6 w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] font-mono text-sm text-[var(--text-primary)]">
      {/* Header */}
      <div 
        className={`flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors ${isOpen ? 'border-b border-[var(--border-color)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronUp size={16} className="text-[var(--text-secondary)]" /> : <ChevronDown size={16} className="text-[var(--text-secondary)]" />}
          <span className="font-bold tracking-widest">{title}</span>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleScanning();
          }} 
          className={`text-xs font-extrabold px-4 py-2 rounded-[1px] cursor-pointer transition-all uppercase tracking-wider text-white ${
            isScanning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {buttonText}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Latest Block</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <span>{latestBlock?.toLocaleString() ?? '0'}</span>
          </div>
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Active Mints</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <span className="text-teal-500">{activeMintsCount}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Blocks Audited</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <span>{blocksScanned?.toLocaleString() ?? '0'}</span>
          </div>
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Scan Speed</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <span>{tps} tx/s</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Engine Status</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isScanning ? 'text-teal-500' : 'text-red-500'}`}>
                {isScanning ? 'ACTIVE' : 'PAUSED'}
              </span>
              {isScanning && (
                <span className="text-[10px] text-[var(--text-secondary)] font-sans truncate max-w-[200px]">
                  ({status})
                </span>
              )}
            </div>
          </div>
          <div className="flex">
            <span className="w-40 text-[var(--text-secondary)]">Scanner Mode</span>
            <span className="mr-4 text-[var(--text-secondary)]">:</span>
            <span className="text-amber-500 font-bold">{mode === 'ERC721' ? 'ERC721 MINT' : 'ERC20 MINT'}</span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
