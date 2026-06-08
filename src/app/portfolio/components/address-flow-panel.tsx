"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatTokenAmount,
  getErrorMessage,
  isValidAddress,
} from "@/app/portfolio/lib/holdings";
import { type BlockscoutTransaction } from "@/app/portfolio/lib/blockscout";
import { useAppContext } from "@/app/components/AppContext";

type AddressFlowPanelProps = {
  address: string;
  isActive?: boolean;
};

const formatTimeAgo = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getEtherscanTxUrl = (hash?: string) =>
  hash ? `https://etherscan.io/tx/${hash}` : null;

export default function AddressFlowPanel({ address, isActive }: AddressFlowPanelProps) {
  const { theme } = useAppContext();
  const [transactions, setTransactions] = useState<BlockscoutTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isActive || hasFetched) return;

    let isMounted = true;

    async function fetchTransactions() {
      if (!isValidAddress(address)) {
        if (isMounted) {
          setTransactions([]);
          setError("Address tidak valid.");
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await fetch(
          `/api/transactions?userAddress=${address.trim()}`,
          { cache: "no-store" }
        );
        const payload = (await response.json()) as unknown;

        if (!response.ok) {
          throw new Error(
            getErrorMessage(payload, "Gagal mengambil transactions dari Blockscout.")
          );
        }

        if (isMounted) {
          setTransactions(
            Array.isArray(payload) ? (payload as BlockscoutTransaction[]) : []
          );
          setHasFetched(true);
        }
      } catch (fetchError) {
        if (isMounted) {
          setTransactions([]);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Gagal mengambil transactions dari Blockscout."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchTransactions();

    return () => {
      isMounted = false;
    };
  }, [address, isActive, hasFetched]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-2xl bg-foreground/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-6 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  if (transactions.length === 0 && hasFetched) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-zinc-400">
        Belum ada transactions yang terdeteksi.
      </div>
    );
  }

  return (
    <div className="divide-y divide-foreground/5">
      {transactions.slice(0, 20).map((transaction) => {
        const fromHash = transaction.from?.hash?.toLowerCase();
        const normalizedAddress = address.toLowerCase();
        const isOutgoing = fromHash === normalizedAddress;
        
        const source = transaction.from;
        const target = transaction.to;
        
        const txUrl = getEtherscanTxUrl(transaction.hash);
        const txKey = transaction.hash || `${transaction.timestamp}-${transaction.block_number}`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const getAvatar = (party: any) => {
          const partyHash = party?.hash?.toLowerCase();
          
          const name = party?.ens_domain_name || party?.name || party?.hash || "?";
          const char = name.replace(/^0x/i, "").charAt(0).toUpperCase();
          const ensName = party?.ens_domain_name;
          
          let avatarUrl = ensName 
            ? `https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(ensName)}`
            : null;

          if (!avatarUrl && partyHash) {
            const charSum = partyHash.split('').reduce((sum: number, c: string) => sum + c.charCodeAt(0), 0);
            const imageIndex = (charSum % 4) + 1; 
            const bgPrefix = theme === 'light' ? 'syntaxbgwhite' : 'syntaxbgblack';
            avatarUrl = `/media/syntax/${bgPrefix}${imageIndex}.png`;
          }

          return (
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-bold text-foreground/60 overflow-hidden relative group border border-foreground/5">
              {avatarUrl && (
                <img 
                  src={avatarUrl} 
                  alt="" 
                  className="absolute inset-0 h-full w-full object-cover z-10"
                  onError={(e) => {
                    if (partyHash && e.currentTarget.dataset.syntaxFallbackApplied !== "true") {
                      e.currentTarget.dataset.syntaxFallbackApplied = "true";
                      const charSum = partyHash.split('').reduce((sum: number, c: string) => sum + c.charCodeAt(0), 0);
                      const imageIndex = (charSum % 4) + 1;
                      const bgPrefix = theme === 'light' ? 'syntaxbgwhite' : 'syntaxbgblack';
                      e.currentTarget.src = `/media/syntax/${bgPrefix}${imageIndex}.png`;
                    } else {
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
              )}
              <span className="relative z-0">{char}</span>
            </div>
          );
        };

        const transactionCard = (
          <div className="flex items-center justify-between py-4 transition hover:bg-foreground/[0.02] gap-4">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              {}
              {getAvatar(source)}
              <span className="text-[13px] font-medium text-foreground truncate max-w-[80px] sm:max-w-[120px]">
                {source?.ens_domain_name || source?.name || "Unknown"}
              </span>

              {}
              <div className="flex items-center gap-1.5 px-0 py-0.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                  {transaction.method || (isOutgoing ? "Send" : "Receive")}
                </span>
              </div>

              {}
              {getAvatar(target)}
              <span className="text-[13px] font-medium text-foreground truncate max-w-[80px] sm:max-w-[120px]">
                {target?.ens_domain_name || target?.name || "Unknown"}
              </span>
            </div>

            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span className="text-[13px] font-bold text-foreground">
                {formatTokenAmount(transaction.value || "0", 18)} ETH
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {formatTimeAgo(transaction.timestamp)}
              </span>
            </div>
          </div>
        );

        if (!txUrl) {
          return <div key={txKey}>{transactionCard}</div>;
        }

        return (
          <Link
            key={txKey}
            href={txUrl}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            {transactionCard}
          </Link>
        );
      })}
    </div>
  );
}
