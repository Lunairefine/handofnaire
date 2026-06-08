'use client'

import { useState, useEffect } from 'react'
import MultisenderType, { SenderType } from '@/app/multisender/components/MultisenderType'
import MultisenderForm from '@/app/multisender/components/MultisenderForm'
import MultisenderControls from '@/app/multisender/components/MultisenderControls'
import MultisenderTable from '@/app/multisender/components/MultisenderTable'
import { sendNative, delay, type TxData } from '@/lib/multisender'
import { CHAINS } from '@/lib/chains'
import { privateKeyToAccount } from 'viem/accounts'

export default function Multisender() {
  const [type, setType] = useState<SenderType>('one-to-many')
  const [pkInput, setPkInput] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [amountInput, setAmountInput] = useState('')
  const [network, setNetwork] = useState('eth')
  
  const [transactions, setTransactions] = useState<TxData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    try {
      let txs: TxData[] = []
      const pks = pkInput.split('\n').map(s => s.trim()).filter(Boolean)
      const targets = targetInput.split('\n').map(s => s.trim()).filter(Boolean)
      const amounts = amountInput.split('\n').map(s => s.trim()).filter(Boolean)

      const getAmt = (i: number) => {
        if (amounts.length === 0) return '0'
        if (amounts.length === 1) return amounts[0]
        return amounts[i] || '0'
      }

      if (type === 'one-to-many' && pks[0]?.startsWith('0x')) {
        const account = privateKeyToAccount(pks[0] as `0x${string}`)
        txs = targets.map((address, i) => ({
          id: `tx-${i}`,
          pk: pks[0] as `0x${string}`,
          from: account.address,
          to: address,
          amount: getAmt(i),
          status: 'pending'
        }))
      } else if (type === 'many-to-one' && targets[0]?.startsWith('0x')) {
        txs = pks.map((pk, i) => {
          let from = 'Invalid PK'
          if (pk.startsWith('0x')) {
            try { from = privateKeyToAccount(pk as `0x${string}`).address } catch {}
          }
          return {
            id: `tx-${i}`,
            pk: pk as `0x${string}`,
            from,
            to: targets[0],
            amount: getAmt(i),
            status: 'pending'
          }
        })
      } else if (type === 'many-to-many') {
        const maxLen = Math.max(pks.length, targets.length)
        if (maxLen > 0) {
          txs = Array.from({ length: maxLen }).map((_, i) => {
            const pk = pks[i] || ''
            const address = targets[i] || 'Invalid Address'
            let from = 'Invalid PK'
            if (pk.startsWith('0x')) {
              try { from = privateKeyToAccount(pk as `0x${string}`).address } catch {}
            }
            return {
              id: `tx-${i}`,
              pk: pk as `0x${string}`,
              from,
              to: address,
              amount: getAmt(i),
              status: 'pending'
            }
          })
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTransactions(txs)
    } catch {
      setTransactions([])
    }
  }, [type, pkInput, targetInput, amountInput])

  const handleClear = () => {
    setPkInput('')
    setTargetInput('')
    setAmountInput('')
    setTransactions([])
  }

  const executeTransactions = async () => {
    setShowConfirm(false)
    setIsProcessing(true)

    const selectedChain = CHAINS[network as keyof typeof CHAINS]
    
    const BATCH_SIZE = 5
    
    for (let i = 0; i < transactions.length; i += BATCH_SIZE) {
      const batch = transactions.slice(i, i + BATCH_SIZE)
      
      await Promise.all(
        batch.map(async (tx) => {
          try {
            const hash = await sendNative({
              pk: tx.pk,
              to: tx.to as `0x${string}`,
              amount: tx.amount,
              chain: selectedChain.chain,
              rpc: selectedChain.rpc
            })
            
            setTransactions(prev => prev.map(t => 
              t.id === tx.id ? { ...t, status: 'success', txHash: hash } : t
            ))
          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Tx Failed'
            setTransactions(prev => prev.map(t => 
              t.id === tx.id ? { ...t, status: 'failed', error: msg } : t
            ))
          }
        })
      )
      
      if (i + BATCH_SIZE < transactions.length) {
        await delay(1000)
      }
    }

    setIsProcessing(false)
  }

  const isValidData = transactions.length > 0 && transactions.every(t => t.from !== 'Invalid PK' && t.to?.startsWith('0x') && parseFloat(t.amount) > 0)

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Multisender</h2>
        <p className="text-[var(--text-secondary)]">
          Distribute or consolidate native tokens efficiently across multiple addresses.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-[1px] p-3 inline-block mt-2">
          <p className="text-sm text-amber-500 font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            Warning: Please use burner wallets. Use at your own risk.
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] p-6">
        {}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Transaction Setup</h3>
            <p className="text-sm text-[var(--text-secondary)]">Configure your multisender parameters below.</p>
          </div>
          <div className="w-full sm:w-64 space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">Network</label>
            <div className="relative">
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                disabled={isProcessing}
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[1px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none cursor-pointer disabled:cursor-not-allowed"
              >
                {Object.entries(CHAINS).map(([key, chain]) => (
                  <option key={key} value={key}>
                    {chain.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <MultisenderType selected={type} onSelect={(t) => { setType(t); handleClear(); }} />
        
        <div className="pt-2">
          <MultisenderForm
            type={type}
            pkInput={pkInput}
            setPkInput={setPkInput}
            targetInput={targetInput}
            setTargetInput={setTargetInput}
            amountInput={amountInput}
            setAmountInput={setAmountInput}
            disabled={isProcessing}
          />
        </div>

        <MultisenderControls
          onSend={() => setShowConfirm(true)}
          onClear={handleClear}
          isLoading={isProcessing}
          hasData={isValidData}
        />
      </div>

      <MultisenderTable transactions={transactions} />

      {}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[1px] p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Confirm Transactions</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              You are about to execute <strong>{transactions.length}</strong> transaction(s) on <strong>{CHAINS[network as keyof typeof CHAINS].name}</strong>. 
              Please ensure your private keys and target addresses are correct. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-[1px] font-medium border border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeTransactions}
                className="px-4 py-2 rounded-[1px] font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
