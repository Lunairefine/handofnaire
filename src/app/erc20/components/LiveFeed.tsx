import React, { useState } from 'react';
import { MintTransaction } from '@/types';
import { shortenAddress, shortenHash, formatTime, getKnownContract } from '@/utils/format';
import { Ban } from 'lucide-react';
import { useAppContext } from '@/app/components/AppContext';
import { NETWORK_CONFIG } from '@/services/networkConfig';

interface LiveFeedProps {
  transactions: MintTransaction[];
  selectedAddress: string | null;
  onSelectContract: (tx: MintTransaction) => void;
  onClearFeed: () => void;
  onBlockContract: (address: string) => void;
  blockedContracts: string[];
  onUnblockContract: (address: string) => void;
  mode?: 'ERC721' | 'ERC20';
}

export default function LiveFeed({
  transactions,
  selectedAddress,
  onSelectContract,
  onClearFeed,
  onBlockContract,
  blockedContracts,
  onUnblockContract,
  mode = 'ERC721'
}: LiveFeedProps) {
  const [filter, setFilter] = useState<string>('all');
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { activeNetwork } = useAppContext();
  const networkConfig = NETWORK_CONFIG[activeNetwork] || NETWORK_CONFIG.ethereum;

  const filteredTxs = transactions.filter(tx => {
    const knownContract = getKnownContract(tx.to);
    if (knownContract?.name === 'UniswapLP' || knownContract?.name === '0 Allowance' || knownContract?.name === 'rwsETH' || knownContract?.name === 'SupernovaLP') return false;

    if (filter === 'all') return true;
    return tx.mintType === filter;
  });

  return (
    <div className={`bg-white/[0.03] border border-[var(--border-color)] rounded-[1px] flex flex-col min-w-0 transition-all ${isOpen ? 'h-[600px] max-h-[calc(100vh-220px)] min-h-[480px]' : 'h-auto'}`}>
      {}
      <div 
        className={`p-3.5 sm:p-4 flex justify-between items-center gap-3 bg-white/[0.03] shrink-0 cursor-pointer hover:bg-[var(--bg-main)]/50 transition-colors ${isOpen ? 'border-b border-[var(--border-color)]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)] font-sans">Mint Events</h2>
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

      {}
      {isOpen && (
        <>
      <div className="flex border-b border-[var(--border-color)] overflow-x-auto no-scrollbar p-1.5 gap-1 bg-[var(--bg-main)]/50 shrink-0">
        {['all', 'public', 'whitelist', 'free', 'paid', 'owner', 'blocked'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-[1px] capitalize transition-all cursor-pointer whitespace-nowrap font-sans border ${
              filter === tab
                ? 'bg-zinc-500/10 border-zinc-500/20 text-zinc-500'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tab === 'blocked' ? `Blocked (${blockedContracts.length})` : tab}
          </button>
        ))}
      </div>

      {}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-3 sm:p-4 space-y-3">
        {filter === 'blocked' ? (
          blockedContracts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <p className="text-xs text-[var(--text-secondary)] font-sans">No temporarily blocked contracts</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Temporarily blocked NFT contracts</span>
                <span className="text-[10px] text-[var(--text-secondary)]">Until page refresh</span>
              </div>
              {blockedContracts.map(address => (
                <div key={address} className="flex items-center justify-between gap-3 p-3 border border-rose-500/20 bg-rose-500/5 rounded-[1px]">
                  <span className="font-mono text-xs text-[var(--text-primary)]">{shortenAddress(address, 7)}</span>
                  <button type="button" onClick={() => onUnblockContract(address)} className="text-[10px] font-bold text-rose-500 hover:text-rose-400">Unblock</button>
                </div>
              ))}
            </div>
          )
        ) : filteredTxs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              {filter === 'all' 
                ? `Waiting for ${networkConfig.name} blocks & mint transactions...` 
                : `No recent mints matching filter "${filter}"`}
            </p>
          </div>
        ) : (
          filteredTxs.map(tx => {
            const isSelected = selectedAddress === tx.contractAddress;
            const knownContract = getKnownContract(tx.to);

            return (
              <div
                key={tx.id}
                onClick={() => onSelectContract(tx)}
                className={`p-3 border rounded-[1px] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-0 sm:gap-3 ${
                  isSelected
                    ? 'border-zinc-500 bg-zinc-500/5'
                    : 'border-[var(--border-color)] bg-[var(--bg-main)] hover:bg-white/[0.03]'
                }`}
              >
                {}
                <div className="flex items-start gap-3 pb-3 sm:pb-0">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                      <span className="font-sans text-xs font-bold text-[var(--text-primary)] flex items-center gap-1 min-w-0" title="Interacted Contract">
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
                        href={`${networkConfig.explorerUrl}/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="text-zinc-500 hover:text-zinc-400 font-semibold hover:underline flex items-center gap-0.5"
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
                  <button
                    type="button"
                    title="Block NFT contract until page refresh"
                    aria-label="Block NFT contract until page refresh"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBlockContract(tx.contractAddress);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 border border-rose-500/25 text-[10px] font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <Ban size={13} />
                      <span>Block</span>
                    </span>
                  </button>
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
