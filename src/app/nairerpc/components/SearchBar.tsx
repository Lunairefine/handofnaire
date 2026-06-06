"use client";

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-5 h-5 text-[var(--text-secondary)]" />
      </div>
      <input
        type="text"
        className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-[1px] focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 p-2.5 outline-none transition-colors"
        placeholder="Cari Jaringan atau Chain ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}