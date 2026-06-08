"use client";

import { useState } from "react";
import { Heart, Copy, Check } from "lucide-react";

export default function Footer() {
  const [copiedDonation, setCopiedDonation] = useState(false);

  return (
    <footer className="w-full bg-[var(--bg-main)] border-t border-[var(--border-color)] shrink-0 z-10 py-3">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText('0x9111c47492a9043d12af0e6c46d57560eebcd9d4');
            setCopiedDonation(true);
            setTimeout(() => setCopiedDonation(false), 2000);
          }}
          className="flex items-center gap-3 px-3 py-1.5 rounded-[1px] border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500/10 transition-colors font-sans text-[10px] cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold">
            <Heart size={12} className="animate-pulse" />
            <span>Donate</span>
          </div>
          {copiedDonation ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
        </button>

        {process.env.NEXT_PUBLIC_COMMIT_HASH && (
          <a
            href={`https://github.com/Lunairefine/handofnaire/commit/${process.env.NEXT_PUBLIC_COMMIT_HASH}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-teal-500 hover:text-teal-400 transition-colors font-medium"
          >
            {process.env.NEXT_PUBLIC_COMMIT_HASH}
          </a>
        )}
      </div>
    </footer>
  );
}
