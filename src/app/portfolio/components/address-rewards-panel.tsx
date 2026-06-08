"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isValidAddress } from "@/app/portfolio/lib/holdings";

type AddressRewardsPanelProps = {
  address: string;
  isActive?: boolean;
};

export default function AddressRewardsPanel({ 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  address, 
  isActive 
}: AddressRewardsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!isActive || hasFetched) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    // Placeholder for future rewards fetching logic
    const timer = setTimeout(() => {
      setIsLoading(false);
      setHasFetched(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [isActive, hasFetched]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-2xl bg-foreground/[0.04] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-500"
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground">Reward System Coming Soon</h3>
      <p className="text-sm text-zinc-500 max-w-xs mt-1">
        We are working on a system to track your airdrop rewards and loyalty points.
      </p>
    </div>
  );
}
