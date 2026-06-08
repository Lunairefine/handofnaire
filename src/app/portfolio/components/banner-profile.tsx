"use client";

import { useEffect, useState } from "react";
import BalanceHistoryChart from "@/app/portfolio/components/balance-history-chart";
import BannerProfileDetails from "@/app/portfolio/components/banner-profile-details";
import {
  extractTokenBalances,
  getTokenUsdValue,
  isValidAddress,
} from "@/app/portfolio/lib/holdings";

type BalanceSnapshot = {
  timestamp: number;
  totalUsd: number;
};

const HISTORY_LIMIT = 48; // Increase points for smoother 24h chart
const HISTORY_EPSILON = 0.0001; // Capture even tiny price movements

const getHistoryStorageKey = (address: string) =>
  `nairescan:balance-history:${address.toLowerCase()}`;

const readStoredHistory = (address: string) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getHistoryStorageKey(address));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as BalanceSnapshot[];
    return parsed.filter(
      (entry) =>
        Number.isFinite(entry.timestamp) && Number.isFinite(entry.totalUsd)
    );
  } catch {
    return [];
  }
};

const writeStoredHistory = (address: string, history: BalanceSnapshot[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getHistoryStorageKey(address),
    JSON.stringify(history)
  );
};

const mergeHistory = (history: BalanceSnapshot[], totalUsd: number) => {
  const now = Date.now();
  const nextHistory = [...history];
  const lastEntry = nextHistory[nextHistory.length - 1];

  if (!lastEntry) {
    return [{ timestamp: now, totalUsd }];
  }

  if (Math.abs(lastEntry.totalUsd - totalUsd) < HISTORY_EPSILON) {
    nextHistory[nextHistory.length - 1] = {
      ...lastEntry,
      timestamp: now,
    };
    return nextHistory;
  }

  nextHistory.push({ timestamp: now, totalUsd });
  return nextHistory.slice(-HISTORY_LIMIT);
};

export default function BannerProfile({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [ensBanner, setEnsBanner] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<"EOA" | "CONTRACT">("EOA");
  const [isVerified, setIsVerified] = useState(false);
  const [history, setHistory] = useState<BalanceSnapshot[]>([]);
  const [currentTotalUsd, setCurrentTotalUsd] = useState<number | null>(null);
  const [currentSnapshotTimestamp, setCurrentSnapshotTimestamp] = useState<number | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEns() {
      if (!isValidAddress(address)) {
        setEnsName(null);
        setEnsAvatar(null);
        setEnsBanner(null);
        setAddressType("EOA");
        setIsVerified(false);
        setIsProfileLoading(false);
        return;
      }

      setEnsName(null);
      setEnsAvatar(null);
      setEnsBanner(null);
      setIsProfileLoading(true);

      try {
        const response = await fetch(`/api/ens?address=${encodeURIComponent(address)}`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("ENS API error");
        }

        const data = (await response.json()) as {
          ensName?: string | null;
          ensAvatar?: string | null;
          ensBanner?: string | null;
          addressType?: "EOA" | "CONTRACT";
          isVerified?: boolean;
          name?: string | null;
          avatar?: string | null;
        };

        if (!controller.signal.aborted) {
          setEnsName(data.ensName ?? data.name ?? null);
          setEnsAvatar(data.ensAvatar ?? data.avatar ?? null);
          setEnsBanner(data.ensBanner ?? null);
          setAddressType(data.addressType ?? "EOA");
          setIsVerified(data.isVerified ?? false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setEnsName(null);
          setEnsAvatar(null);
          setEnsBanner(null);
          setAddressType("EOA");
          setIsVerified(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsProfileLoading(false);
        }
      }
    }

    fetchEns();

    return () => {
      controller.abort();
    };
  }, [address]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBalanceTrend() {
      if (!isValidAddress(address)) {
        setHistory([]);
        setCurrentTotalUsd(null);
        setCurrentSnapshotTimestamp(null);
        setIsChartLoading(false);
        return;
      }

      const storedHistory = readStoredHistory(address);
      setHistory(storedHistory);
      setCurrentTotalUsd(storedHistory[storedHistory.length - 1]?.totalUsd ?? null);
      setCurrentSnapshotTimestamp(
        storedHistory[storedHistory.length - 1]?.timestamp ?? null
      );
      setIsChartLoading(true);

      try {
        const response = await fetch(
          `/api/holdings?userAddress=${encodeURIComponent(address.trim())}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const holdings = extractTokenBalances(payload);
        const totalUsd = holdings.reduce(
          (sum, token) => sum + getTokenUsdValue(token),
          0
        );

        if (controller.signal.aborted) {
          return;
        }

        setCurrentTotalUsd(totalUsd);

        if (holdings.length > 0 || storedHistory.length > 0) {
          const nextHistory = mergeHistory(storedHistory, totalUsd);
          writeStoredHistory(address, nextHistory);
          setHistory(nextHistory);
          setCurrentSnapshotTimestamp(
            nextHistory[nextHistory.length - 1]?.timestamp ?? null
          );
        }
      } catch {
      } finally {
        if (!controller.signal.aborted) {
          setIsChartLoading(false);
        }
      }
    }

    fetchBalanceTrend();

    return () => {
      controller.abort();
    };
  }, [address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `0x${address.slice(2, 6)}...${address.slice(-4)}`;
  const headingLabel = ensName || shortAddress;
  const ensAvatarFallback = ensName
    ? `https://metadata.ens.domains/mainnet/avatar/${encodeURIComponent(ensName)}`
    : null;

  return (
    <div 
      className="relative w-full overflow-hidden transition-all duration-500"
      style={{
        minHeight: "300px",
      }}
    >
      {/* Banner Background */}
      {ensBanner ? (
        <div className="absolute inset-0 z-0">
          <img 
            src={ensBanner} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-foreground/[0.03]" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-12 pb-6 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <BannerProfileDetails
            address={address}
            headingLabel={headingLabel}
            ensAvatar={ensAvatar}
            ensAvatarFallback={ensAvatarFallback}
            addressType={addressType}
            isVerified={isVerified}
            copied={copied}
            isLoading={isProfileLoading}
            onCopy={handleCopy}
          />
          <BalanceHistoryChart
            history={history}
            currentTotalUsd={currentTotalUsd}
            currentSnapshotTimestamp={currentSnapshotTimestamp}
            isLoading={isChartLoading}
          />
        </div>
      </div>
    </div>
  );
}
