"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildHoldingsSummary,
  formatTokenAmount,
  formatUsd,
  getTokenUsdValue,
  getErrorMessage,
  isValidAddress,
  extractTokenBalances,
  type AddressTokenBalance,
} from "@/app/portfolio/lib/holdings";

type AddressHoldingsPanelProps = {
  address: string;
};

export default function AddressHoldingsPanel({
  address,
}: AddressHoldingsPanelProps) {
  const [holdings, setHoldings] = useState<AddressTokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHoldings() {
      if (!isValidAddress(address)) {
        if (isMounted) {
          setHoldings([]);
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
        const response = await fetch(`/api/holdings?userAddress=${address.trim()}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as unknown;

        if (!response.ok) {
          throw new Error(
            getErrorMessage(payload, "Gagal mengambil holdings dari Blockscout.")
          );
        }

        if (isMounted) {
          setHoldings(extractTokenBalances(payload));
        }
      } catch (fetchError) {
        if (isMounted) {
          setHoldings([]);
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Gagal mengambil holdings dari Blockscout."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchHoldings();

    return () => {
      isMounted = false;
    };
  }, [address]);

  const holdingsSummary = useMemo(
    () => buildHoldingsSummary(holdings),
    [holdings]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-20 rounded-2xl bg-white/[0.04]" />
        <div className="h-20 rounded-2xl bg-white/[0.04]" />
        <div className="h-20 rounded-2xl bg-white/[0.04]" />
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

  if (holdings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-zinc-400">
        Tidak ada asset terdeteksi.
      </div>
    );
  }

  return (
    <div className="divide-y divide-foreground/5">
      {holdingsSummary.nativeAsset ? (
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 overflow-hidden">
              <img 
                src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/icon/eth.png" 
                alt="ETH" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-foreground">ETH</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-semibold text-foreground">
              {formatTokenAmount(
                holdingsSummary.nativeAsset.balance,
                holdingsSummary.nativeAsset.decimals
              )}
            </p>
            <p className="text-[11px] text-zinc-500">
              {formatUsd(getTokenUsdValue(holdingsSummary.nativeAsset))}
            </p>
          </div>
        </div>
      ) : null}

      {holdingsSummary.sortedTokens.map((token) => {
        const tokenAmount = formatTokenAmount(token.balance, token.decimals);

        return (
          <div
            key={`${token.address}-${token.id}`}
            className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              {token.icon ? (
                <img
                  src={token.icon}
                  alt={token.symbol || token.name || "token"}
                  className="h-8 w-8 rounded-full bg-foreground/5"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/5 text-[10px] text-zinc-500">
                  N/A
                </div>
              )}
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  {token.displaySymbol || token.symbol || "Unknown"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[13px] font-semibold text-foreground">{tokenAmount}</p>
              <p className="text-[11px] text-zinc-500">{formatUsd(getTokenUsdValue(token))}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
