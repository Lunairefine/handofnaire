'use client'

import { BalanceResult } from '@/lib/balance'
import { copyToClipboard, truncateAddress } from '@/lib/utils'

interface BalanceTableProps {
  results: BalanceResult[]
}

const formatValue = (val: string) => {
  const num = parseFloat(val)
  if (num === 0) return '0.00'
  if (num < 0.0001) return '< 0.0001'
  return num.toFixed(4)
}

export default function BalanceTable({ results }: BalanceTableProps) {
  if (results.length === 0) return null

  return (
    <div className="mt-8 border border-[var(--border-color)] rounded-[1px] overflow-hidden bg-[var(--bg-main)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-medium">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">ETH</th>
              <th className="px-6 py-4">BASE</th>
              <th className="px-6 py-4">OP</th>
              <th className="px-6 py-4">BSC</th>
              <th className="px-6 py-4">HYPEREVM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {results.map((item, idx) => {
              const ethBal = item.balances.find(b => b.chain === 'eth')?.balance || '0'
              const baseBal = item.balances.find(b => b.chain === 'base')?.balance || '0'
              const opBal = item.balances.find(b => b.chain === 'op')?.balance || '0'
              const bscBal = item.balances.find(b => b.chain === 'bsc')?.balance || '0'
              const hypeBal = item.balances.find(b => b.chain === 'hyperevm')?.balance || '0'

              return (
                <tr key={idx} className="hover:bg-[var(--bg-surface)] transition-colors">
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-[var(--bg-surface)] px-2 py-1 rounded-[1px] text-teal-600 dark:text-teal-400">
                        {truncateAddress(item.address)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(item.address)}
                        className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
                        title="Copy Address"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-sans">{formatValue(ethBal)}</td>
                  <td className="px-6 py-4 font-sans">{formatValue(baseBal)}</td>
                  <td className="px-6 py-4 font-sans">{formatValue(opBal)}</td>
                  <td className="px-6 py-4 font-sans">{formatValue(bscBal)}</td>
                  <td className="px-6 py-4 font-sans">{formatValue(hypeBal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
