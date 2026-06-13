import React, { useState } from 'react';
import { MintTransaction } from '@/types';
import { shortenAddress, shortenHash, formatTime, getKnownContract } from '@/utils/format';
import { Trash2, Shield, User, Globe, Coins, Flame, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface LiveFeedProps {
  transactions: MintTransaction[];
  selectedAddress: string | null;
  onSelectContract: (tx: MintTransaction) => void;
  onClearFeed: () => void;
  mode?: 'ERC721' | 'ERC20';
}

const typeConfig = {
  public: { label: 'Public', bg: 'bg-sky-500/10 dark:bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-600 dark:text-sky-400', icon: Globe },
  whitelist: { label: 'Whitelist', bg: 'bg-teal-500/10 dark:bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-600 dark:text-teal-400', icon: Shield },
  owner: { label: 'Owner', bg: 'bg-rose-500/10 dark:bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', icon: User },
  free: { label: 'Free', bg: 'bg-emerald-500/10 dark:bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: Coins },
  paid: { label: 'Paid', bg: 'bg-amber-500/10 dark:bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', icon: Flame },
};

export default function LiveFeed({
  transactions,
  selectedAddress,
  onSelectContract,
  onClearFeed,
  mode = 'ERC721'
}: LiveFeedProps) {
  const [filter, setFilter] = useState<string>('all');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const filteredTxs = transactions.filter(tx => {
    const knownContract = getKnownContract(tx.to);
    if (knownContract?.name === 'UniswapLP' || knownContract?.name === '0 Allowance' || knownContract?.name === 'rwsETH' || knownContract?.name === 'SupernovaLP') return false;

    if (filter === 'all') return true;
    return tx.mintType === filter;
  });

  return (
    <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] flex flex-col transition-all ${isOpen ? 'h-[600px]' : 'h-auto'}`}>
      {}
      <div 
        className={`p-4 flex justify-between items-center bg-[var(--bg-surface)] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors ${isOpen ? 'border-b border-[var(--border-color)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronUp size={16} className="text-[var(--text-secondary)]" /> : <ChevronDown size={16} className="text-[var(--text-secondary)]" />}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">Realtime Mint Stream</h2>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClearFeed();
          }}
          className="text-xs text-[var(--text-secondary)] hover:text-rose-500 transition-colors flex items-center gap-1.5 p-1 px-2 rounded-[1px] hover:bg-rose-500/5 cursor-pointer font-sans border border-transparent hover:border-[var(--border-color)]"
        >
          <Trash2 size={13} />
          Clear
        </button>
      </div>

      {}
      {isOpen && (
        <>
          <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar p-1 gap-1 bg-[var(--bg-main)]/50 shrink-0">
        {['all', 'public', 'whitelist', 'free', 'paid', 'owner'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-[1px] capitalize transition-all cursor-pointer whitespace-nowrap font-sans border ${
              filter === tab
                ? 'bg-teal-500/10 border-teal-500/20 text-teal-500'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filteredTxs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              {filter === 'all' 
                ? 'Waiting for Ethereum blocks & mint transactions...' 
                : `No recent mints matching filter "${filter}"`}
            </p>
          </div>
        ) : (
          filteredTxs.map(tx => {
            const config = typeConfig[tx.mintType];
            const TypeIcon = config.icon;
            const isSelected = selectedAddress === tx.contractAddress;
            const knownContract = getKnownContract(tx.to);

            return (
              <div
                key={tx.id}
                onClick={() => onSelectContract(tx)}
                className={`p-3 border rounded-[1px] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-0 sm:gap-3 ${
                  isSelected
                    ? 'border-teal-500 bg-teal-500/5 glow-accent'
                    : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                {}
                <div className="flex items-start gap-3 pb-3 sm:pb-0">
                  <div className={`p-2 rounded-[1px] border ${config.bg} ${config.border} ${config.text} shrink-0`}>
                    <TypeIcon size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-bold text-[var(--text-primary)] flex items-center gap-1" title="Interacted Contract">
                        To: {knownContract ? (
                          <span className={`${knownContract.color} font-extrabold`}>{knownContract.name}</span>
                        ) : (
                          shortenAddress(tx.to, 5)
                        )}
                      </span>
                      <span className="font-sans text-[10px] font-medium text-[var(--text-secondary)]" title="Token Contract">
                        Token: {shortenAddress(tx.contractAddress, 4)}
                      </span>
                      <span className="text-[9px] text-[var(--text-secondary)] font-sans ml-1">
                        {formatTime(tx.timestamp)}
                      </span>
                    </div>
                    
                    {}
                    <div className="flex items-center gap-1.5 mt-0.5 font-sans text-[10px]">
                      <span className="text-[var(--text-secondary)]">Tx Hash:</span>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="text-teal-500 hover:text-teal-400 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        {shortenHash(tx.hash, 5)}
                      </a>
                    </div>

                    <p className="text-[10px] font-sans text-[var(--text-secondary)] mt-1 font-semibold">
                      Function : <span className="text-[var(--text-primary)]">{tx.functionName.split('(')[0].trim()}</span>
                    </p>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-color)]">
                  <div className="text-left sm:text-right font-sans">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {tx.quantity} {mode === 'ERC721' ? `NFT${tx.quantity > 1 ? 's' : ''}` : 'Tokens'}
                    </span>
                    <p className="text-[9px] text-[var(--text-secondary)] font-medium">
                      {parseFloat(tx.value) === 0 ? 'FREE' : `${tx.value} ETH`}
                    </p>
                  </div>
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
