'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface WalletControlsProps {
  onGenerate: (count: number) => void
  onStartVanity: (options: { prefix: string; suffix: string; isCaseSensitive: boolean }) => void
  onStopVanity: () => void
  onExport: () => void
  isGeneratingVanity: boolean
  progress: number
}

export default function WalletControls({
  onGenerate,
  onStartVanity,
  onStopVanity,
  onExport,
  isGeneratingVanity,
  progress,
}: WalletControlsProps) {
  const [count, setCount] = useState(10)
  const [isVanityMode, setIsVanityMode] = useState(false)
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [isCaseSensitive, setIsCaseSensitive] = useState(false)

  return (
    <div className="space-y-6 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Wallet Generator</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--text-secondary)]">Vanity Mode</label>
          <button
            onClick={() => setIsVanityMode(!isVanityMode)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-[1px] transition-colors",
              isVanityMode ? "bg-teal-500" : "bg-[var(--border-color)]"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-[1px] bg-[var(--bg-main)] transition-transform",
                isVanityMode ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>

      {!isVanityMode ? (
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Number of Wallets</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min="1"
              max="1000"
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => onGenerate(count)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-[1px] transition-colors"
          >
            Generate
          </button>
          <button
            onClick={onExport}
            className="border border-[var(--border-color)] hover:bg-[var(--bg-surface)] font-medium px-6 py-2 rounded-[1px] transition-colors"
          >
            Export .txt
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Prefix (e.g. 0xabc)</label>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="0x..."
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Suffix</label>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="...xyz"
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="caseSensitive"
              checked={isCaseSensitive}
              onChange={(e) => setIsCaseSensitive(e.target.checked)}
              className="rounded-[1px] border-[var(--border-color)] text-teal-500 focus:ring-teal-500"
            />
            <label htmlFor="caseSensitive" className="text-sm text-[var(--text-secondary)]">
              Case Sensitive
            </label>
          </div>
          <div className="flex items-center gap-4">
            {!isGeneratingVanity ? (
              <button
                onClick={() => onStartVanity({ prefix, suffix, isCaseSensitive })}
                className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-[1px] transition-colors"
              >
                Start Brute Force
              </button>
            ) : (
              <button
                onClick={onStopVanity}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-[1px] transition-colors"
              >
                Stop
              </button>
            )}
            <button
              onClick={onExport}
              className="border border-[var(--border-color)] hover:bg-[var(--bg-surface)] font-medium px-6 py-2 rounded-[1px] transition-colors"
            >
              Export .txt
            </button>
          </div>
          {isGeneratingVanity && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Searching...</span>
                <span>{progress.toLocaleString()} attempts</span>
              </div>
              <div className="w-full bg-[var(--border-color)] h-1.5 rounded-[1px] overflow-hidden">
                <div className="bg-teal-500 h-full animate-pulse w-full" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
