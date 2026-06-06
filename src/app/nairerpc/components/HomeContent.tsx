"use client";
import React, { useState, useMemo } from 'react';
import { chains } from '../lib/chains';
import SearchBar from './SearchBar';
import ChainCard from './ChainCard';

export default function HomeContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);
  
  const displayedChains = useMemo(() => {
    let filtered = chains;
    if (searchTerm.trim() !== '') {
      filtered = chains.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.chainId.toString().includes(searchTerm));
      return filtered;
    }
    const popularChainIds = [1, 56, 137, 42161, 10, 43114, 999, 8453, 59144];
    const sortedChains = [...chains].sort((a, b) => {
      const aIndex = popularChainIds.indexOf(a.chainId);
      const bIndex = popularChainIds.indexOf(b.chainId);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
    return sortedChains.slice(0, visibleCount);
  }, [searchTerm, visibleCount]);
  
  const handleShowMore = () => {
    setVisibleCount(prev => prev + 9);
  };
  
  return (
    <div className="flex-grow w-full pb-6">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold font-sans text-[var(--text-primary)]">RPC Scanner</h2>
        <p className="text-[var(--text-secondary)] text-sm font-sans max-w-2xl">
          Agregator RPC Publik dengan Pemilihan Otomatis & Tercepat.
        </p>
      </div>
      
      <div className="w-full flex justify-start mb-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedChains.map((chain) => (<ChainCard key={chain.chainId} chain={chain} />))}
        {displayedChains.length === 0 && (<p className="text-[var(--text-secondary)] col-span-full text-center">Tidak ada jaringan yang ditemukan.</p>)}
      </div>
      
      {searchTerm.trim() === '' && visibleCount < chains.length && (
        <div className="flex justify-center mt-10">
          <button 
            onClick={handleShowMore} 
            className="bg-[var(--bg-surface)] hover:bg-[var(--border-color)] border border-[var(--border-color)] text-[var(--text-primary)] px-6 py-2 rounded-[1px] transition-colors text-sm font-medium"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}