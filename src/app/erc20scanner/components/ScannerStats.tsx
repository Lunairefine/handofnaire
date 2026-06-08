import React from 'react';
import { Activity, ShieldAlert, Cpu, Layers } from 'lucide-react';
import { useAppContext } from '@/app/components/AppContext';

interface ScannerStatsProps {
  latestBlock: number;
  blocksScanned: number;
  activeMintsCount: number;
  tps: number;
  status: string;
  mode: string;
}

export default function ScannerStats({
  latestBlock,
  blocksScanned,
  activeMintsCount,
  tps,
  status,
  mode
}: ScannerStatsProps) {
  const { isScanning } = useAppContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-[1px] relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-sans">Latest Eth Block</p>
            <h3 className="text-2xl font-bold font-sans mt-1 text-[var(--text-primary)]">
              {latestBlock?.toLocaleString() ?? '0'}
            </h3>
          </div>
          <div className="p-2 bg-teal-500/10 text-teal-500 rounded-[1px] border border-teal-500/20">
            <Layers size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {isScanning ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
          <span className="text-[10px] text-[var(--text-secondary)] truncate font-sans">
            {isScanning ? status : 'Scanner paused'}
          </span>
        </div>
      </div>

      {}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-[1px] relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-sans">Blocks Audited</p>
            <h3 className="text-2xl font-bold font-sans mt-1 text-[var(--text-primary)]">
              {blocksScanned?.toLocaleString() ?? '0'}
            </h3>
          </div>
          <div className="p-2 bg-sky-500/10 text-sky-500 rounded-[1px] border border-sky-500/20">
            <Activity size={18} />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-[var(--text-secondary)] flex justify-between font-sans">
          <span>Engine Status</span>
          <span className={`font-bold ${isScanning ? 'text-teal-500' : 'text-rose-500'}`}>
            {isScanning ? 'ACTIVE' : 'PAUSED'}
          </span>
        </div>
      </div>

      {}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-[1px] relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-sans">Active Mints</p>
            <h3 className="text-2xl font-bold font-sans mt-1 text-teal-500">
              {activeMintsCount}
            </h3>
          </div>
          <div className="p-2 bg-purple-500/10 text-purple-500 rounded-[1px] border border-purple-500/20">
            <ShieldAlert size={18} />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-[var(--text-secondary)] flex justify-between font-sans">
          <span>Unique Collections</span>
          <span className="text-[var(--text-primary)] font-bold">Last 100 Tx</span>
        </div>
      </div>

      {}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-[1px] relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-sans">Scan Speed (TPS)</p>
            <h3 className="text-2xl font-bold font-sans mt-1 text-[var(--text-primary)]">
              {tps} <span className="text-[10px] text-[var(--text-secondary)] font-normal">tx/s</span>
            </h3>
          </div>
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-[1px] border border-indigo-500/20">
            <Cpu size={18} />
          </div>
        </div>
        <div className="mt-3 text-[10px] text-[var(--text-secondary)] flex justify-between font-sans">
          <span>Scanner Mode</span>
          <span className="text-amber-500 font-bold uppercase">
            {mode === 'ERC721' ? 'ERC721 Mint' : 'ERC20 Mint'}
          </span>
        </div>
      </div>
    </div>
  );
}
