'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function PortfolioSearchPage() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!address.trim()) return;
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(address.trim());
    
    if (!isValid) {
      setError('Invalid address format. Please enter a valid 0x EVM address.');
      return;
    }
    
    setError('');
    router.push(`/portfolio/${address.trim()}`);
  };

  return (
    <div className="w-full overflow-x-hidden flex flex-col items-center justify-start pt-[12vh] md:pt-[24vh] pb-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center select-none overflow-hidden w-full">
          <h2 className="text-[clamp(1.75rem,8.5vw,3.5rem)] font-bold font-sans tracking-tight uppercase whitespace-nowrap text-center">HAND OF NAIRE</h2>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="0x..."
              className="flex-1 bg-transparent border border-[var(--border-color)] rounded-[1px] px-6 py-4 text-base focus:outline-none focus:border-teal-400 dark:focus:border-teal-400 font-mono transition-colors placeholder-[var(--text-secondary)]"
            />
            <button
              onClick={handleSearch}
              className="bg-teal-500 hover:bg-teal-600 text-black px-8 py-4 rounded-[1px] font-bold transition-colors flex items-center justify-center text-base"
            >
              Explore
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
}
