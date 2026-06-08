'use client'

interface BalanceInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function BalanceInput({ value, onChange, disabled }: BalanceInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-primary)]">
        Wallet Addresses
      </label>
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="0xaddress (one per line, max 50)"
          className="w-full h-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] p-4 font-sans text-sm resize-none focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
        />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">
        Addresses: {value.split('\n').filter(a => a.trim().startsWith('0x')).length} / 50
      </p>
    </div>
  )
}
