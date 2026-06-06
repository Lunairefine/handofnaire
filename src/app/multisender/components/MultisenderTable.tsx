'use client'

import { TxData } from '@/lib/multisender'
import { truncateAddress } from '@/lib/utils'

interface MultisenderTableProps {
  transactions: TxData[]
}

export default function MultisenderTable({ transactions }: MultisenderTableProps) {
  if (transactions.length === 0) return null

  return (
    <div className="mt-8 border border-[var(--border-color)] rounded-[1px] overflow-hidden bg-[var(--bg-main)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-medium">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">From</th>
              <th className="px-6 py-4">To</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {transactions.map((tx, idx) => (
              <tr key={tx.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                <td className="px-6 py-4 text-[var(--text-secondary)]">{idx + 1}</td>
                <td className="px-6 py-4">
                  <code className="bg-[var(--bg-surface)] px-2 py-1 rounded-[1px] text-[var(--text-secondary)]">
                    {truncateAddress(tx.from)}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-[var(--bg-surface)] px-2 py-1 rounded-[1px] text-teal-600 dark:text-teal-400">
                    {truncateAddress(tx.to)}
                  </code>
                </td>
                <td className="px-6 py-4 font-sans">{tx.amount}</td>
                <td className="px-6 py-4">
                  {tx.status === 'pending' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-[1px] text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                      Pending
                    </span>
                  )}
                  {tx.status === 'success' && (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-[1px] text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 w-fit">
                        Success
                      </span>
                      {tx.txHash && (
                        <a href={`#`} className="text-xs text-teal-500 hover:underline" title={tx.txHash}>
                          {truncateAddress(tx.txHash)}
                        </a>
                      )}
                    </div>
                  )}
                  {tx.status === 'failed' && (
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-[1px] text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 w-fit">
                        Failed
                      </span>
                      {tx.error && (
                        <span className="text-xs text-red-500 max-w-[150px] truncate" title={tx.error}>
                          {tx.error}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
