"use client";

import { ChainData } from '@/app/nairerpc/types';
import { useRPCScanner } from '@/app/nairerpc/hooks/useRPCScanner';
import { addNetworkToWallet } from '@/app/nairerpc/lib/walletUtils';

export default function ChainCard({ chain }: { chain: ChainData }) {
  const { results } = useRPCScanner(chain.rpcUrls);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getLatencyColor = (latency: number, status: string) => {
    if (status === 'offline' || latency === Infinity) return 'text-red-500';
    if (latency < 200) return 'text-green-500';
    if (latency <= 500) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusText = (latency: number, status: string) => {
    if (status === 'offline' || latency === Infinity) return 'Offline';
    if (status === 'checking') return 'Checking...';
    return `${latency}ms`;
  };

  const fastestRpc = results.length > 0 && results[0].status === 'online' ? results[0].url : chain.rpcUrls[0];

  return (
    <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] p-5 hover:border-[var(--text-secondary)] transition-colors flex flex-col gap-4 shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-3">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-primary)] transition-colors">
            {chain.name}
          </h2>
          <span className="text-xs text-[var(--text-secondary)]">Chain ID: {chain.chainId}</span>
        </div>
      </div>

      <div className="space-y-3 flex-grow">
        {results.map((rpc, idx) => (
          <div 
            key={idx} 
            onClick={() => copyToClipboard(rpc.url)}
            className="flex flex-col gap-1 bg-[var(--bg-surface)] p-3 rounded-[1px] border border-[var(--border-color)] hover:border-[var(--text-secondary)] transition-colors cursor-pointer group"
            title="Klik untuk menyalin"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm truncate w-2/3 flex items-center gap-2 text-[var(--text-primary)] group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                {rpc.url}
              </span>
              <span className={`text-xs font-mono flex items-center gap-1 ${getLatencyColor(rpc.latency, rpc.status)}`}>
                {getStatusText(rpc.latency, rpc.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => addNetworkToWallet(chain, fastestRpc)}
        className="w-full mt-2 flex items-center justify-center gap-2 bg-zinc-500 hover:bg-zinc-600 text-white py-2 rounded-[1px] text-sm transition-colors font-medium cursor-pointer"
      >
        Add Network
      </button>
    </div>
  );
}
