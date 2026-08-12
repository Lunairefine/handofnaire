'use client';

import React, { useState } from 'react';
import { useOpenseaDrops } from '@/hooks/useOpenseaDrops';
import { OpenseaDrop } from '@/types';
import OpenseaStats from '@/app/opensea/components/OpenseaStats';
import LiveDrops from '@/app/opensea/components/LiveDrops';
import DropDetails from '@/app/opensea/components/DropDetails';

export default function OpenseaScannerPage() {
  const {
    drops,
    isLoading,
    isScanning,
    toggleScanning,
    clearDrops,
    activeCount,
    apiError,
  } = useOpenseaDrops();

  const [selectedDrop, setSelectedDrop] = useState<OpenseaDrop | null>(null);

  const handleSelectDrop = (drop: OpenseaDrop) => {
    setSelectedDrop(drop);
  };

  return (
    <>
      <OpenseaStats
        activeCount={activeCount}
        totalFound={drops.length}
        isScanning={isScanning}
        isLoading={isLoading}
        apiError={apiError}
        toggleScanning={toggleScanning}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-6">
        <div className="lg:col-span-7">
          <LiveDrops
            drops={drops}
            selectedDropId={selectedDrop?.id || null}
            onSelectDrop={handleSelectDrop}
            onClearFeed={clearDrops}
            isLoading={isLoading}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <DropDetails
            drop={selectedDrop}
          />
        </div>
      </div>
    </>
  );
}
