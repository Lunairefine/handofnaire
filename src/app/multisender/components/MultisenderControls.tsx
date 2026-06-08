'use client'



interface MultisenderControlsProps {
  network: string
  setNetwork: (net: string) => void
  onSend: () => void
  onClear: () => void
  isLoading: boolean
  hasData: boolean
}

export default function MultisenderControls({
  onSend,
  onClear,
  isLoading,
  hasData
}: Omit<MultisenderControlsProps, 'network' | 'setNetwork'>) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 pt-6 border-t border-[var(--border-color)]">
      <button
        onClick={onSend}
        disabled={isLoading || !hasData}
        className="w-full md:flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-[1px] transition-colors flex items-center justify-center text-base"
      >
        {isLoading ? 'Processing...' : 'Send Transactions'}
      </button>

      <button
        onClick={onClear}
        disabled={isLoading}
        className="w-full md:flex-1 border border-[var(--border-color)] hover:bg-[var(--bg-surface)] disabled:opacity-50 font-medium px-8 py-3 rounded-[1px] transition-colors flex items-center justify-center text-base"
      >
        Clear
      </button>
    </div>
  )
}
