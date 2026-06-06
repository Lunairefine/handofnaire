'use client'

import { SenderType } from './MultisenderType'

interface MultisenderFormProps {
  type: SenderType
  pkInput: string
  setPkInput: (val: string) => void
  targetInput: string
  setTargetInput: (val: string) => void
  amountInput: string
  setAmountInput: (val: string) => void
  disabled?: boolean
}

export default function MultisenderForm({
  type,
  pkInput,
  setPkInput,
  targetInput,
  setTargetInput,
  amountInput,
  setAmountInput,
  disabled
}: MultisenderFormProps) {
  return (
    <div className="space-y-6">
      {type === 'one-to-many' && (
        <div className="space-y-6">
          <div className="space-y-2 max-w-xl">
            <label className="text-sm font-medium">Private Key (Sender)</label>
            <input
              type="password"
              value={pkInput}
              onChange={(e) => setPkInput(e.target.value)}
              disabled={disabled}
              placeholder="0x..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Enter the single private key that will fund all transactions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Receivers (Target Addresses)</label>
              <textarea
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                disabled={disabled}
                placeholder="0x123...&#10;0x456..."
                className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">List of addresses, one per line.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amounts</label>
              <textarea
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                disabled={disabled}
                placeholder="0.1&#10;0.5&#10;(or enter just one amount for all)"
                className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">Amounts corresponding to each address.</p>
            </div>
          </div>
        </div>
      )}

      {type === 'many-to-one' && (
        <div className="space-y-6">
          <div className="space-y-2 max-w-xl">
            <label className="text-sm font-medium">Target Address (Receiver)</label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              disabled={disabled}
              placeholder="0x..."
              className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-3 font-sans text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Enter the single destination address.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Senders (Private Keys)</label>
              <textarea
                value={pkInput}
                onChange={(e) => setPkInput(e.target.value)}
                disabled={disabled}
                placeholder="0xpk1...&#10;0xpk2..."
                className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">List of private keys, one per line.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amounts</label>
              <textarea
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                disabled={disabled}
                placeholder="0.1&#10;0.5&#10;(or enter just one amount for all)"
                className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
              />
              <p className="text-xs text-[var(--text-secondary)] mt-1">Amounts to send from each wallet.</p>
            </div>
          </div>
        </div>
      )}

      {type === 'many-to-many' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Senders (Private Keys)</label>
            <textarea
              value={pkInput}
              onChange={(e) => setPkInput(e.target.value)}
              disabled={disabled}
              placeholder="0xpk1...&#10;0xpk2..."
              className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">1 PK per line.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Receivers (Target Addresses)</label>
            <textarea
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              disabled={disabled}
              placeholder="0xtarget1...&#10;0xtarget2..."
              className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">1 Address per line.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amounts</label>
            <textarea
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              disabled={disabled}
              placeholder="0.1&#10;0.5&#10;(or enter just one amount for all)"
              className="w-full h-64 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed whitespace-pre overflow-x-auto"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">1 Amount per line.</p>
          </div>
        </div>
      )}
    </div>
  )
}
