import React, { useState } from 'react';
import { ContractMetadata, MintTransaction } from '@/types';
import { shortenAddress, shortenHash, getKnownContract } from '@/utils/format';
import { ExternalLink, Compass, Zap, Copy, Check, Hash, Coins, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

interface ContractDetailsProps {
  metadata: ContractMetadata | null;
  selectedTx: MintTransaction | null;
  isLoading: boolean;
  mode?: 'ERC721' | 'ERC20';
}

export default function ContractDetails({
  metadata,
  selectedTx,
  isLoading,
  mode = 'ERC721'
}: ContractDetailsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  if (!selectedTx) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-[1px] h-[480px] flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3 rounded-[1px]">
          <Compass size={20} className="animate-pulse-slow" />
        </div>
        <p className="text-sm font-semibold text-[var(--text-primary)] font-sans uppercase tracking-wider">No Transaction Selected</p>
        <p className="text-xs text-[var(--text-secondary)] mt-2 max-w-xs font-sans">
          Select any mint transaction from the realtime stream to analyze its transaction hash, contract details, and narrative rules.
        </p>
      </div>
    );
  }



  const progressPercent = metadata 
    ? (metadata.maxSupply === 'Unknown' || metadata.totalSupply === '0' || isNaN(parseInt(metadata.totalSupply)) || isNaN(parseInt(metadata.maxSupply)) 
       ? 0 
       : Math.min(100, Math.max(0, (parseInt(metadata.totalSupply) / parseInt(metadata.maxSupply)) * 100)))
    : 0;

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? 'h-auto' : 'h-[49px]'}`}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="text-[var(--text-secondary)]">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <Compass size={16} className="text-teal-500" />
          <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">
            Contract Details
          </h2>
        </div>
      </div>
      <div className={`flex flex-col gap-5 p-5 flex-1 overflow-y-auto no-scrollbar justify-between transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div>
        {}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Coins size={13} className="text-teal-500" />
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
                Smart Contract Metadata
              </h3>
            </div>
            {isLoading && (
              <span className="text-[10px] text-teal-500 font-sans animate-pulse-slow">
                Syncing RPC...
              </span>
            )}
          </div>

          {isLoading || !metadata ? (
            <div className="border border-[var(--border-color)] bg-[var(--bg-main)]/30 p-4 rounded-[1px] flex flex-col gap-3.5 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-[var(--border-color)] w-1/3 rounded-[1px]"></div>
                <div className="h-3.5 bg-[var(--border-color)] w-1/6 rounded-[1px]"></div>
              </div>
              <div className="space-y-1.5 mt-1">
                <div className="h-3 bg-[var(--border-color)] w-full rounded-[1px]"></div>
                <div className="h-2 bg-[var(--border-color)] w-full rounded-[1px]"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="h-10 bg-[var(--border-color)] rounded-[1px]"></div>
                <div className="h-10 bg-[var(--border-color)] rounded-[1px]"></div>
              </div>
            </div>
          ) : (
            <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-4 rounded-[1px] space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {metadata.imageUrl && (
                    <img 
                      src={metadata.imageUrl} 
                      alt={metadata.name} 
                      className="w-10 h-10 rounded-[1px] object-cover bg-[var(--bg-surface)] border border-[var(--border-color)] shrink-0" 
                    />
                  )}
                  <div>
                    <span className="font-sans text-[9px] text-teal-500 bg-teal-500/10 px-1.5 py-0.5 rounded-[1px] font-bold uppercase border border-teal-500/20">
                      {metadata.symbol || 'NFT'}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <h2 className="text-sm font-extrabold text-[var(--text-primary)]">{metadata.name}</h2>
                      <a 
                        href={`https://opensea.io/assets/ethereum/${selectedTx.contractAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[var(--text-secondary)] hover:text-[#2081E2] transition-colors"
                        title="View on OpenSea"
                      >
                        <img 
                          src="https://static.seadn.io/logos/Logomark-White.svg" 
                          alt="OpenSea" 
                          className="w-3.5 h-3.5 opacity-70 hover:opacity-100 transition-opacity" 
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <span className={`text-[9px] font-sans font-bold px-1.5 py-0.5 border rounded-[1px] uppercase ${
                  metadata.mintStatus === 'Active'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                    : metadata.mintStatus === 'Paused'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                }`}>
                  {metadata.mintStatus}
                </span>
              </div>

              {}
              <div>
                <div className="flex justify-between items-center text-[10px] font-sans mb-1.5">
                  <span className="text-[var(--text-secondary)] font-medium">Mint Progress</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {metadata.totalSupply !== 'Unknown' ? parseInt(metadata.totalSupply).toLocaleString() : 'Unknown'} / {metadata.maxSupply !== 'Unknown' ? parseInt(metadata.maxSupply).toLocaleString() : 'Unknown'} ({progressPercent.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-[1px] overflow-hidden border border-[var(--border-color)]">
                  <div
                    className="bg-teal-500 h-full rounded-[1px] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1 text-[9px] text-[var(--text-secondary)] font-sans">
                  <span>Available: {metadata.availableMint !== 'Unknown' ? parseInt(metadata.availableMint).toLocaleString() : 'Unknown'}</span>
                  <span>Unminted: {metadata.maxSupply !== 'Unknown' && metadata.totalSupply !== 'Unknown' ? Math.max(0, parseInt(metadata.maxSupply) - parseInt(metadata.totalSupply)).toLocaleString() : 'Unknown'}</span>
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 gap-3 font-sans text-[10px]">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 rounded-[1px]">
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase">Mint Price</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5">
                    {parseFloat(metadata.mintPrice) === 0 ? 'FREE' : `${metadata.mintPrice} ETH`}
                  </p>
                </div>
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-2.5 rounded-[1px] overflow-hidden">
                  <p className="text-[9px] text-[var(--text-secondary)] uppercase">Contract Owner</p>
                  <p className="font-bold text-[var(--text-primary)] mt-0.5 truncate" title={metadata.owner}>
                    {shortenAddress(metadata.owner, 4)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="border-t border-[var(--border-color)] pt-4 mt-2">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Hash size={13} className="text-teal-500" />
            <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider font-sans">
              Transaction Analyzer & Link Hash
            </h3>
          </div>

          <div className="border border-[var(--border-color)] bg-[var(--bg-main)] p-3 rounded-[1px] font-sans text-[11px] space-y-2.5">
            {}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">TX HASH:</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenHash(selectedTx.hash, 8)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.hash, 'tx')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Tx Hash"
                >
                  {copiedField === 'tx' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/tx/${selectedTx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">INTERACTED CONTRACT (TO):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                {(() => {
                  const known = getKnownContract(selectedTx.to);
                  return known ? (
                    <span className={`${known.color} font-extrabold truncate text-right`}>
                      {known.name}
                    </span>
                  ) : (
                    <span className="font-bold text-[var(--text-primary)] truncate text-right">
                      {shortenAddress(selectedTx.to, 6)}
                    </span>
                  );
                })()}
                <button 
                  onClick={() => handleCopy(selectedTx.to, 'to')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Interacted Contract"
                >
                  {copiedField === 'to' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.to}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">TOKEN CONTRACT (NFT):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(selectedTx.contractAddress, 6)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.contractAddress, 'ca')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Token CA"
                >
                  {copiedField === 'ca' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.contractAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {}
            <div className="flex justify-between items-center py-1 border-b border-[var(--border-color)]/50 gap-2">
              <span className="text-[var(--text-secondary)] shrink-0">SENDER (FROM):</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-[var(--text-primary)] truncate text-right">{shortenAddress(selectedTx.from, 6)}</span>
                <button 
                  onClick={() => handleCopy(selectedTx.from, 'from')}
                  className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors cursor-pointer shrink-0"
                  title="Copy Sender Address"
                >
                  {copiedField === 'from' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
                <a
                  href={`https://etherscan.io/address/${selectedTx.from}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 hover:text-teal-400 shrink-0 flex items-center gap-0.5"
                  title="View on Etherscan"
                >
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">QUANTITY:</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {selectedTx.quantity} {mode === 'ERC721' ? 'NFT' : 'Tokens'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">VALUE:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedTx.value} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">SELECTOR:</span>
                <span className="font-bold text-teal-500">{selectedTx.functionSelector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">BLOCK NO:</span>
                <span className="font-bold text-[var(--text-primary)]">#{selectedTx.blockNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
