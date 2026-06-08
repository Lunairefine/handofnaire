"use client";

import { useState } from "react";
import AddressFlowPanel from "@/app/portfolio/components/address-flow-panel";
import AddressHoldingsPanel from "@/app/portfolio/components/address-holdings-panel";
import AddressRewardsPanel from "@/app/portfolio/components/address-rewards-panel";

type PortfolioTab = "holdings" | "flow" | "reward";

const tabs: Array<{ id: PortfolioTab; label: string }> = [
  { id: "holdings", label: "Holdings" },
  { id: "flow", label: "Flow" },
  { id: "reward", label: "Reward" },
];

export default function AddressPortfolioSection({
  address,
}: {
  address: string;
}) {
  const [activeTab, setActiveTab] = useState<PortfolioTab>("holdings");

  return (
    <section className="w-full py-4 sm:py-6">
      <div className="flex items-center gap-8 border-b border-foreground/10 pb-3">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-2 text-sm font-semibold transition ${
                isActive
                  ? "text-foreground"
                  : "text-zinc-500 hover:text-foreground"
              }`}
            >
              {tab.label}
              <span
                className={`absolute inset-x-0 bottom-0 h-px transition ${
                  isActive ? "bg-teal-500 dark:bg-teal-400" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        <div className={activeTab === "holdings" ? "block" : "hidden"}>
          <AddressHoldingsPanel address={address} />
        </div>
        <div className={activeTab === "flow" ? "block" : "hidden"}>
          <AddressFlowPanel address={address} isActive={activeTab === "flow"} />
        </div>
        <div className={activeTab === "reward" ? "block" : "hidden"}>
          <AddressRewardsPanel address={address} isActive={activeTab === "reward"} />
        </div>
      </div>
    </section>
  );
}
