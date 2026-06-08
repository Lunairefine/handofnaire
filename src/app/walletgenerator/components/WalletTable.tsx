'use client'

import { useState } from 'react'
import { WalletData } from '@/lib/wallet'
import { copyToClipboard, truncateAddress } from '@/lib/utils'

interface WalletTableProps {
  wallets: WalletData[]
}

export default function WalletTable({ wallets }: WalletTableProps) {
  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({})

  const toggleKey = (index: number) => {
    setShowKeys((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  if (wallets.length === 0) return null

  return (
    <div className="mt-8 border border-[var(--border-color)] rounded-[1px] overflow-hidden bg-[var(--bg-main)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-medium">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Private Key</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {wallets.map((wallet, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-surface)] transition-colors">
                <td className="px-6 py-4 text-[var(--text-secondary)]">{idx + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-[var(--bg-surface)] px-2 py-1 rounded-[1px] text-teal-600 dark:text-teal-400">
                      {truncateAddress(wallet.address)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(wallet.address)}
                      className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
                      title="Copy Address"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="bg-[var(--bg-surface)] px-2 py-1 rounded-[1px] text-[var(--text-secondary)]">
                      {showKeys[idx] ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </code>
                    <button
                      onClick={() => toggleKey(idx)}
                      className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
                      title={showKeys[idx] ? "Hide Private Key" : "Show Private Key"}
                    >
                      {showKeys[idx] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88 14.12 14.12"/><path d="M2 2l20 20"/><path d="M4.35 4.35A10 10 0 0 0 2 12s3 6 10 6c1.17 0 2.23-.2 3.19-.55"/><path d="M6.66 6.66A10 10 0 0 1 12 6c7 0 10 6 10 6a13.12 13.12 0 0 1-1.13 1.94"/><path d="M15 11a3 3 0 0 0-3-3"/><circle cx="12" cy="12" r="3" className="hidden"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(wallet.privateKey)}
                      className="text-[var(--text-secondary)] hover:text-teal-500 transition-colors"
                      title="Copy Private Key"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
