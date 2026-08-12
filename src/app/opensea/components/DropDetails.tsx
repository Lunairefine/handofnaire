import React, { useState } from 'react';
import { OpenseaDrop } from '@/types';
import { shortenAddress } from '@/utils/format';
import { ExternalLink, Store, Copy, Check, ChevronDown, ChevronUp, Image as ImageIcon, Clock, Users, BarChart3 } from 'lucide-react';

interface DropDetailsProps {
  drop: OpenseaDrop | null;
}

function formatPrice(val: number | string | null, symbol: string = 'ETH'): string {
  if (val === null) return '—';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || num === 0) return 'FREE';
  return `${num} ${symbol}`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function DropDetails({ drop }: DropDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!drop) {
    return (
      <div className="bg-white/[0.03] border border-[var(--border-color)] p-6 rounded-[1px] h-[480px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3 rounded-[1px]">
          <Store size={20} className="animate-pulse-slow" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)] font-sans uppercase tracking-wider">No Drop Selected</p>
        <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-xs font-sans">
          Select any drop from the list to view collection details, mint stage, floor price, and contract information.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white/[0.03] border border-[var(--border-color)] rounded-[1px] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'h-auto' : 'h-[49px]'}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-white/[0.03] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="text-[var(--text-secondary)]">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <Store size={16} className="text-teal-500" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">
            Drop Details
          </h2>
        </div>
      </div>
      
      <div className={`flex flex-col gap-5 p-5 flex-1 overflow-y-auto no-scrollbar transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <ImageIcon size={13} className="text-teal-500" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
              Collection
            </h3>
          </div>

          <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-4 rounded-[1px] space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img 
                  src={drop.imageUrl} 
                  alt={drop.name} 
                  className="w-12 h-12 rounded-[1px] object-cover bg-white/[0.03] border border-[var(--border-color)] shrink-0" 
                />
                <div>
                  <span className="font-sans text-[9px] text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded-[1px] font-bold uppercase border border-teal-500/20 capitalize">
                    {drop.chain}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    <h2 className="text-sm font-extrabold text-[var(--text-primary)]">{drop.name}</h2>
                    <a 
                      href={drop.openseaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--text-secondary)] hover:text-[#2081E2] transition-colors"
                      title="View on OpenSea"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
              <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 border rounded-[1px] uppercase ${
                drop.isMinting
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
              }`}>
                {drop.isMinting ? 'Minting Now' : 'Ended'}
              </span>
            </div>

            {drop.description && (
              <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                <p className="font-medium text-[var(--text-primary)] text-[10px] opacity-80 line-clamp-3">{drop.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 font-sans text-[10px]">
              <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                <p className="text-[9px] text-[var(--text-secondary)] uppercase">Mint Price</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {formatPrice(drop.mintPrice)}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                <p className="text-[9px] text-[var(--text-secondary)] uppercase">Floor Price</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {drop.floorPrice !== null ? `${drop.floorPrice} ${drop.floorPriceSymbol}` : '—'}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                <p className="text-[9px] text-[var(--text-secondary)] uppercase">Total Supply</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {drop.totalSupply !== null ? drop.totalSupply.toLocaleString() : '—'}
                </p>
              </div>
              <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                <p className="text-[9px] text-[var(--text-secondary)] uppercase">Max Per Wallet</p>
                <p className="font-bold text-[var(--text-primary)] mt-0.5">
                  {drop.maxPerWallet || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {drop.isMinting && drop.stageLabel && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <Clock size={13} className="text-teal-500" />
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
                Active Mint Stage
              </h3>
            </div>
            <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded-[1px] font-sans text-[11px] space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)]">STAGE:</span>
                <span className="font-bold text-[var(--text-primary)]">{drop.stageLabel}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)]">TYPE:</span>
                <span className="font-bold text-teal-500 uppercase">{drop.stageType?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50">
                <span className="text-[var(--text-secondary)]">START:</span>
                <span className="font-bold text-[var(--text-primary)]">{formatDate(drop.startTime)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--text-secondary)]">END:</span>
                <span className="font-bold text-[var(--text-primary)]">{formatDate(drop.endTime)}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <BarChart3 size={13} className="text-teal-500" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
              Market Stats
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3 font-sans text-[10px]">
            <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
              <p className="text-[9px] text-[var(--text-secondary)] uppercase">Volume</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">
                {drop.totalVolume !== null ? `${drop.totalVolume.toFixed(2)} ETH` : '—'}
              </p>
            </div>
            <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
              <p className="text-[9px] text-[var(--text-secondary)] uppercase">Sales</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">
                {drop.totalSales !== null ? drop.totalSales.toLocaleString() : '—'}
              </p>
            </div>
            <div className="bg-white/[0.03] border border-[var(--border-color)] p-2.5 rounded-[1px]">
              <p className="text-[9px] text-[var(--text-secondary)] uppercase">Owners</p>
              <p className="font-bold text-[var(--text-primary)] mt-0.5">
                {drop.numOwners !== null ? drop.numOwners.toLocaleString() : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Users size={13} className="text-teal-500" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
              Contract & Links
            </h3>
          </div>

          <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded-[1px] font-sans text-[11px] space-y-2.5">
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">CONTRACT:</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(drop.contractAddress, 8)}</span>
                <button 
                  onClick={() => handleCopy(drop.contractAddress, 'ca')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Contract"
                >
                  {copiedField === 'ca' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${drop.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {drop.owner && (
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
                <span className="text-[var(--text-secondary)] shrink-0">OWNER:</span>
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(drop.owner, 8)}</span>
                  <button 
                    onClick={() => handleCopy(drop.owner!, 'owner')}
                    className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                    title="Copy Owner Address"
                  >
                    {copiedField === 'owner' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">DROP TYPE:</span>
              <span className="font-bold text-teal-500 text-right">{drop.dropType}</span>
            </div>

            {drop.category && (
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
                <span className="text-[var(--text-secondary)] shrink-0">CATEGORY:</span>
                <span className="font-bold text-[var(--text-primary)] capitalize">{drop.category}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={drop.openseaUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-teal-500 hover:text-teal-400 font-semibold hover:underline"
              >
                OpenSea
              </a>
              {drop.twitterUsername && (
                <>
                  <span className="text-[var(--text-secondary)]">•</span>
                  <a
                    href={`https://x.com/${drop.twitterUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-teal-500 hover:text-teal-400 font-semibold hover:underline"
                  >
                    𝕏 @{drop.twitterUsername}
                  </a>
                </>
              )}
              {drop.discordUrl && (
                <>
                  <span className="text-[var(--text-secondary)]">•</span>
                  <a
                    href={drop.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-teal-500 hover:text-teal-400 font-semibold hover:underline"
                  >
                    Discord
                  </a>
                </>
              )}
              {drop.projectUrl && (
                <>
                  <span className="text-[var(--text-secondary)]">•</span>
                  <a
                    href={drop.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-teal-500 hover:text-teal-400 font-semibold hover:underline"
                  >
                    Website
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
