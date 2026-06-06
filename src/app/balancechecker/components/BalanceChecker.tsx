'use client'

import { useState } from 'react'
import BalanceInput from '@/app/balancechecker/components/BalanceInput'
import BalanceControls from '@/app/balancechecker/components/BalanceControls'
import BalanceTable from '@/app/balancechecker/components/BalanceTable'
import { getBalances, BalanceResult } from '@/lib/balance'

export default function BalanceChecker() {
  const [inputAddresses, setInputAddresses] = useState('')
  const [results, setResults] = useState<BalanceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleCheck = async () => {
    const rawAddresses = inputAddresses.split('\n').map(a => a.trim()).filter(a => a.startsWith('0x'))
    if (rawAddresses.length === 0) return

    // Limit to max 50 addresses per run as per rules
    const addressesToProcess = rawAddresses.slice(0, 50)

    setIsLoading(true)

    try {
      const data = await Promise.all(
        addressesToProcess.map(async (address) => {
          const balances = await getBalances(address)
          return { address, balances }
        })
      )
      setResults(data)
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setInputAddresses('')
    setResults([])
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Multi-Chain Balance Checker</h2>
        <p className="text-[var(--text-secondary)]">
          Check native coin balances across multiple networks simultaneously.
        </p>
      </div>

      <div className="space-y-6 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] p-6">
        <BalanceInput 
          value={inputAddresses} 
          onChange={setInputAddresses} 
          disabled={isLoading}
        />
        <BalanceControls 
          onCheck={handleCheck} 
          onClear={handleClear} 
          isLoading={isLoading} 
          hasData={results.length > 0}
        />
      </div>

      <BalanceTable results={results} />
    </div>
  )
}
