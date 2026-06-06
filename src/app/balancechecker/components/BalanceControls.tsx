'use client'

interface BalanceControlsProps {
  onCheck: () => void
  onClear: () => void
  isLoading: boolean
  hasData: boolean
}

export default function BalanceControls({ onCheck, onClear, isLoading, hasData }: BalanceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onCheck}
        disabled={isLoading}
        className="flex-1 md:flex-none bg-teal-500 hover:bg-teal-600 disabled:bg-teal-500/50 text-white font-medium px-8 py-2.5 rounded-[1px] transition-colors flex items-center justify-center min-w-[160px]"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Checking...</span>
          </div>
        ) : (
          'Check Balance'
        )}
      </button>
      <button
        onClick={onClear}
        disabled={isLoading || !hasData}
        className="flex-1 md:flex-none border border-[var(--border-color)] hover:bg-[var(--bg-surface)] disabled:opacity-50 font-medium px-8 py-2.5 rounded-[1px] transition-colors"
      >
        Clear
      </button>
    </div>
  )
}
