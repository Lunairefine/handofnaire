import React from 'react';
import { Store, Activity, Zap, AlertTriangle } from 'lucide-react';

interface OpenseaStatsProps {
  activeCount: number;
  totalFound: number;
  isScanning: boolean;
  isLoading: boolean;
  apiError: string | null;
  toggleScanning: () => void;
}

export default function OpenseaStats({
  activeCount,
  totalFound,
  isScanning,
  isLoading,
  apiError,
  toggleScanning
}: OpenseaStatsProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[var(--bg-surface)] p-4 rounded-[1px] border border-[var(--border-color)]">
        <div className="flex items-center gap-3 md:border-r border-[var(--border-color)] pr-4">
          <div className="p-2.5 rounded-[1px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
            <Store size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider font-sans mb-0.5">Minting Now</p>
            <p className="text-xl font-extrabold text-[var(--text-primary)] font-sans">{isLoading ? '—' : activeCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:border-r border-[var(--border-color)] px-4">
          <div className="p-2.5 rounded-[1px] bg-teal-500/10 border border-teal-500/20 text-teal-500">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider font-sans mb-0.5">Total Drops</p>
            <p className="text-xl font-extrabold text-[var(--text-primary)] font-sans">{isLoading ? '—' : totalFound}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 col-span-1 md:col-span-2 justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-[1px] border ${isScanning ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
              <Zap size={20} className={isScanning ? 'animate-pulse' : ''} />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider font-sans mb-0.5">Auto Refresh</p>
              <p className="text-sm font-extrabold text-[var(--text-primary)] font-sans flex items-center gap-2">
                {isLoading ? 'LOADING...' : isScanning ? 'ACTIVE' : 'PAUSED'}
                {isScanning && !isLoading && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={toggleScanning}
            className={`px-4 py-2 rounded-[1px] text-[11px] font-bold tracking-wider uppercase font-sans transition-all border cursor-pointer ${
              isScanning
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {isScanning ? 'Stop' : 'Start Auto Refresh'}
          </button>
        </div>
      </div>

      {apiError && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/5 border border-rose-500/20 rounded-[1px]">
          <AlertTriangle size={14} className="text-rose-500 shrink-0" />
          <p className="text-[11px] text-rose-400 font-sans font-medium">{apiError}</p>
        </div>
      )}
    </div>
  );
}
