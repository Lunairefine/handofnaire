"use client";


interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-[1px] focus:ring-zinc-500 focus:border-zinc-500 block w-full px-3 py-2.5 outline-none transition-colors"
        placeholder="Search Network or Chain ID..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
