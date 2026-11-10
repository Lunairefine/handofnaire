import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { OpenseaDrop } from '@/types';

interface LiveDropsProps {
  drops: OpenseaDrop[];
  selectedDropId: string | null;
  onSelectDrop: (drop: OpenseaDrop) => void;
  onClearFeed: () => void;
  isLoading: boolean;
}

function formatFloorPrice(drop: OpenseaDrop): string {
  if (drop.floorPrice === null || drop.floorPrice === 0) return '—';
  return `${drop.floorPrice} ${drop.floorPriceSymbol}`;
}

function formatMintPrice(price: string): string {
  const val = parseFloat(price);
  if (isNaN(val) || val === 0) return 'FREE';
  return `${val} ETH`;
}

export default function LiveDrops({
  drops,
  selectedDropId,
  onSelectDrop,
  onClearFeed,
  isLoading,
}: LiveDropsProps) {
  const [filter, setFilter] = useState<string>('all');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const filteredDrops = drops.filter(drop => {
    if (filter === 'all') return true;
    if (filter === 'minting') return drop.isMinting;
    if (filter === 'ended') return !drop.isMinting;
    return true;
  });

  return (
    <div className={`bg-white/[0.03] border border-[var(--border-color)] rounded-[1px] flex flex-col transition-all ${isOpen ? 'h-[600px]' : 'h-auto'}`}>
      <div 
        className={`p-4 flex justify-between items-center bg-white/[0.03] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors ${isOpen ? 'border-b border-[var(--border-color)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">Opensea Recent Drops</h2>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClearFeed();
          }}
          className="text-xs text-[var(--text-secondary)] hover:text-rose-500 transition-colors flex items-center gap-1.5 p-1 px-2 rounded-[1px] hover:bg-rose-500/5 cursor-pointer font-sans border border-transparent hover:border-[var(--border-color)]"
        >
          Clear
        </button>
      </div>

      {isOpen && (
        <>
          <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar p-1 gap-1 bg-[var(--bg-main)]/50 shrink-0">
            {['all', 'minting', 'ended'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-[1px] capitalize transition-all cursor-pointer whitespace-nowrap font-sans border ${
                  filter === tab
                    ? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'ended' ? 'Recently Ended' : tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-xs text-[var(--text-secondary)] font-sans">Fetching drops from OpenSea...</p>
              </div>
            ) : filteredDrops.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-xs text-[var(--text-secondary)] font-sans">
                  {filter === 'all' 
                    ? 'No drops found.' 
                    : `No drops matching filter "${filter}"`}
                </p>
              </div>
            ) : (
              filteredDrops.map(drop => {
                const isSelected = selectedDropId === drop.id;

                return (
                  <div
                    key={drop.id}
                    onClick={() => onSelectDrop(drop)}
                    className={`p-3 border rounded-[1px] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-zinc-500 bg-zinc-500/5 glow-accent'
                        : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={drop.imageUrl} 
                        alt={drop.name} 
                        className="w-10 h-10 rounded-[1px] object-cover bg-white/[0.03] border border-[var(--border-color)] shrink-0" 
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-bold text-[var(--text-primary)]">
                            {drop.name}
                          </span>
                          <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-[1px] border uppercase ${
                            drop.isMinting
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            {drop.isMinting ? 'Minting Now' : 'Ended'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 font-sans text-[10px] text-[var(--text-secondary)]">
                          <span className="capitalize">{drop.chain}</span>
                          <span>•</span>
                          <span>Floor: <span className="text-[var(--text-primary)] font-semibold">{formatFloorPrice(drop)}</span></span>
                          <span>•</span>
                          <span>Price: <span className="text-[var(--text-primary)] font-semibold">{formatMintPrice(drop.mintPrice)}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-color)]">
                      {drop.stageLabel && (
                        <span className="text-[9px] font-sans font-medium text-[var(--text-secondary)] bg-white/[0.03] border border-[var(--border-color)] px-1.5 py-0.5 rounded-[1px] truncate max-w-[120px]">
                          {drop.stageLabel}
                        </span>
                      )}
                      <a
                        href={drop.openseaUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-500 hover:text-zinc-400 shrink-0 flex items-center gap-0.5"
                        title="View on OpenSea"
                      >
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
